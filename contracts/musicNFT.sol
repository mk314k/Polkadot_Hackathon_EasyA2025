// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMusicGame {
    function contests(uint8 contestId) external view returns (address creator, uint8 musicID, uint8 numPlayer, uint8 spy, uint8 maxRounds, uint8 currentRound, uint8 vcount, uint8 ucount);
}

contract MusicNFT {
    string public name = "MusicNFT";
    string public symbol = "MUSNFT";

    uint256 public tokenCounter;
    address public owner;
    address public gameContract; // Deployed MusicGame contract

    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => string) public tokenURI;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor(address _gameContract) {
        owner = msg.sender;
        gameContract = _gameContract;
        tokenCounter = 0;
    }

    function mintFromGame(uint8 contestId, string memory _tokenURI) public returns (uint256) {
        require(gameContract != address(0), "Game contract not set");

        (address contestWinner, , , , uint8 maxRounds, uint8 currentRound, , ) = IMusicGame(gameContract).contests(contestId);

        require(currentRound >= maxRounds, "Contest not ended");
        require(msg.sender == contestWinner, "Only winner can mint");

        tokenCounter++;
        uint256 newTokenId = tokenCounter;

        ownerOf[newTokenId] = msg.sender;
        balanceOf[msg.sender] += 1;
        tokenURI[newTokenId] = _tokenURI;

        emit Transfer(address(0), msg.sender, newTokenId);

        return newTokenId;
    }

    function setGameContract(address _gameContract) external {
        require(msg.sender == owner, "Only owner");
        gameContract = _gameContract;
    }
}
