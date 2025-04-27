// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MusicNFT {
    string public name = "MusicNFT";
    string public symbol = "MUSNFT";

    uint256 public tokenCounter;
    address public owner;

    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => string) public tokenURI;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        tokenCounter = 0;
    }

    function mint(address recipient, string memory _tokenURI) public onlyOwner returns (uint256) {
        tokenCounter++;
        uint256 newTokenId = tokenCounter;

        ownerOf[newTokenId] = recipient;
        balanceOf[recipient] += 1;
        tokenURI[newTokenId] = _tokenURI;

        emit Transfer(address(0), recipient, newTokenId);

        return newTokenId;
    }
}
