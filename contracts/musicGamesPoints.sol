// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MusicGame {
    struct Contest {
        address creator;
        mapping(uint8 => address) players;
        uint8 numPlayer;
        uint8 spy;
        uint8 maxRounds;
        uint8 currentRound;
        mapping(uint8 => uint16) points;
        mapping(uint8 => uint8) votes;
        mapping(uint8 => uint8) submissions;
        bool started;
        bool submitted;
    }

    uint8 public contestCounter;
    mapping(uint8 => Contest) public contests;
    mapping(uint8 => address) internal winners;

    event ContestCreated(uint8 indexed contestId);
    event PlayerJoined(uint8 indexed contestId, address player);
    event ContestStarted(uint8 indexed contestId);
    event RoundSubmitted(uint8 indexed contestId, address player);
    event RoundVoted(uint8 indexed contestId, address voter);
    event RoundEnded(uint8 indexed contestId, uint8 round);
    event ContestEnded(uint8 indexed contestId, address winner);

    function createContest(uint8 maxRounds) public {
        contestCounter++;
        require(contestCounter > 0, "Contest limit reached");
        Contest storage c = contests[contestCounter];
        c.creator = msg.sender;
        c.maxRounds = maxRounds;
        emit ContestCreated(contestCounter);
    }

    function joinContest(uint8 contestId) public {
        Contest storage c = contests[contestId];
        require(!c.started, "Contest already started");
        require(c.numPlayer < 15, "Contest full");
        c.players[c.numPlayer] = msg.sender;
        // c.points[c.numPlayer] = 1000;
        c.numPlayer++;
        emit PlayerJoined(contestId, msg.sender);
    }

    function startContest(uint8 contestId) public {
        Contest storage c = contests[contestId];
        require(msg.sender == c.creator, "Only creator can start");
        require(c.numPlayer >= 3, "Not enough players");
        c.started = true;
        c.currentRound = 1;
        for (uint8 i = 0; i < c.numPlayer; i++) {
            c.points[i] = 50 * c.numPlayer * c.maxRounds;
        }
        assignSpy(contestId);
        resetRound(contestId);
        emit ContestStarted(contestId);
    }

    function assignSpy(uint8 contestId) internal {
        Contest storage c = contests[contestId];
        c.spy = uint8(block.timestamp % c.numPlayer);
    }

    function playCard(uint8 contestId, uint8 playerIndex, uint8 cardIndex) public {
        Contest storage c = contests[contestId];
        require(c.started, "Contest not started");
        require(cardIndex > 0, "Invalid Card");
        c.submissions[playerIndex] = 1;

        bool done = true;
        for (uint8 i = 0; i < c.numPlayer; i++) {
            if (c.submissions[i] == 0) {
                done = false;
                break;
            }
        }
        c.submitted = done;
        emit RoundSubmitted(contestId, msg.sender);
    }

    function vote(uint8 contestId, uint8 voterIndex, uint8 suspectIndex) public {
        Contest storage c = contests[contestId];
        require(c.submitted, "Not all players submitted yet");
        c.votes[voterIndex] = suspectIndex;

        bool done = true;
        for (uint8 i = 0; i < c.numPlayer; i++) {
            if (c.votes[i] == 0) {
                done = false;
                break;
            }
        }
        emit RoundVoted(contestId, msg.sender);

        if (done) {
            endRound(contestId);
        }
    }

    function endRound(uint8 contestId) internal {
        Contest storage c = contests[contestId];
        require(c.started, "Contest not started");

        for (uint8 i = 0; i < c.numPlayer; i++) {
            if (c.votes[i] == c.spy) {
                c.points[i] += 50;
                c.points[c.spy] -= 50;
            } else{
                c.points[i] -= 50;
                c.points[c.spy] += 50;
            }
        }

        c.currentRound++;
        if (c.currentRound > c.maxRounds) {
            c.started = false;
            awardWinner(contestId);
        } else {
            assignSpy(contestId);
            resetRound(contestId);
        }
        emit RoundEnded(contestId, c.currentRound);
    }

    function resetRound(uint8 contestId) internal {
        Contest storage c = contests[contestId];
        c.submitted = false;
        for (uint8 i = 0; i < c.numPlayer; i++) {
            c.votes[i] = 0;
            c.submissions[i] = 0;
        }
    }

    function awardWinner(uint8 contestId) internal {
        Contest storage c = contests[contestId];
        uint16 maxPoints = 0;
        address winner;

        for (uint8 i = 0; i < c.numPlayer; i++) {
            if (c.points[i] > maxPoints) {
                maxPoints = c.points[i];
                winner = c.players[i];
            }
        }

        emit ContestEnded(contestId, winner);
        delete contests[contestId];
    }
}
