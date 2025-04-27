// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MusicGameWithMoney {
    address public owner;
    uint8 public contestCounter;

    struct Contest {
        address creator;
        uint8 musicID;       // 🎵 <-- Music identifier
        uint8 maxPlayersAllowed;
        uint8 numPlayer;
        uint8 spy;
        uint8 maxRounds;
        uint8 currentRound;
        mapping(uint8 => address) players;
        mapping(uint8 => uint16) points;
        mapping(uint8 => uint8) submissions;
        mapping(uint8 => uint8) votes;
        uint8 ucount;
        uint8 vcount;
        uint256 entryFee;
        uint256 totalPot;
    }

    mapping(uint8 => Contest) public contests;

    event ContestCreated(uint8 indexed contestId);
    event PlayerJoined(uint8 indexed contestId, uint8 indexed playerIndex);
    event ContestEnded(uint8 indexed contestId, address winner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createContest(uint8 maxRounds, uint8 maxPlayersAllowed, uint8 musicID) public {
        contestCounter++;
        require(maxRounds < 15 && maxPlayersAllowed <= 15, "Constraints exceeded");

        Contest storage c = contests[contestCounter];
        c.creator = msg.sender;
        c.maxRounds = maxRounds;
        c.maxPlayersAllowed = maxPlayersAllowed;
        c.musicID = musicID; // 🎵 store music ID
        c.entryFee = 0.0005 ether * maxRounds * maxPlayersAllowed;

        emit ContestCreated(contestCounter);
    }

    function joinContest(uint8 contestId) external payable {
        Contest storage c = contests[contestId];
        require(c.currentRound == 0, "Already started");
        require(c.numPlayer < c.maxPlayersAllowed, "Full");
        require(msg.value == c.entryFee, "Wrong fee");

        c.players[c.numPlayer] = msg.sender;
        c.points[c.numPlayer] = 1000;
        c.numPlayer++;
        c.totalPot += msg.value;

        emit PlayerJoined(contestId, c.numPlayer - 1);
    }

    function startContest(uint8 contestId) external {
        Contest storage c = contests[contestId];
        require(msg.sender == c.creator, "Only creator");
        require(c.numPlayer >= 3, "Need 3+ players");

        c.currentRound = 1;
        c.spy = uint8(block.timestamp % c.numPlayer);
        _resetRound(c);
    }

    function playCard(uint8 contestId, uint8 playerIndex, uint8 cardIndex) external {
        Contest storage c = contests[contestId];
        require(c.currentRound > 0, "Not started");

        c.submissions[playerIndex] = cardIndex;
        c.ucount++;
    }

    function vote(uint8 contestId, uint8 voterIndex, uint8 suspectIndex) external {
        Contest storage c = contests[contestId];
        require(c.ucount == c.numPlayer, "Waiting submissions");

        c.votes[voterIndex] = suspectIndex;
        c.vcount++;

        if (c.vcount == c.numPlayer) {
            _endRound(contestId);
        }
    }

    function _endRound(uint8 contestId) internal {
        Contest storage c = contests[contestId];

        for (uint8 i = 0; i < c.numPlayer; i++) {
            if (c.votes[i] == c.spy) {
                c.points[i] += 1;
                c.points[c.spy] -= 1;
            } else {
                c.points[i] -= 1;
                c.points[c.spy] += 1;
            }
        }

        c.currentRound++;
        if (c.currentRound > c.maxRounds) {
            _awardWinner(contestId);
        } else {
            c.spy = uint8(block.timestamp % c.numPlayer);
            _resetRound(c);
        }
    }

    function _resetRound(Contest storage c) internal {
        c.ucount = 0;
        c.vcount = 0;
        for (uint8 i = 0; i < c.numPlayer; i++) {
            c.submissions[i] = 0;
            c.votes[i] = 0;
        }
    }

    function _awardWinner(uint8 contestId) internal {
        Contest storage c = contests[contestId];
        address winner;
        uint16 maxPoints = 0;

        for (uint8 i = 0; i < c.numPlayer; i++) {
            if (c.points[i] > maxPoints) {
                maxPoints = c.points[i];
                winner = c.players[i];
            }
        }

        c.creator = winner;
        uint256 winnerPrize = (c.totalPot * 95) / 100;
        uint256 ownerCut = c.totalPot - winnerPrize;

        payable(winner).transfer(winnerPrize);
        payable(owner).transfer(ownerCut);

        emit ContestEnded(contestId, winner);
    }
}
