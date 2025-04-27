import { ContractRunner, ethers } from 'ethers';

export class MusicGameContract {
  public gameContract: ethers.Contract;
  public nftContract: ethers.Contract;
  
  public gameAddress: string = "0xC03B5d3895F9a9b9a47993a73569F13cb443eeA8";
  public nftAddress: string = "0x0EdBFbB852751836BcEC638067D1A04C9B4F011d.";

  public gameAbi = [
    "function createContest(uint8 maxRounds, uint8 musicID) public",
    "function joinContest(uint8 contestId) public",
    "function startContest(uint8 contestId) public",
    "function playCard(uint8 contestId, uint8 playerIndex, uint8 cardIndex) public",
    "function vote(uint8 contestId, uint8 voterIndex, uint8 suspectIndex) public",
    "function contestCounter() view returns (uint8)",
    "function contests(uint8 contestId) view returns (address creator, uint8 musicID, uint8 numPlayer, uint8 spy, uint8 maxRounds, uint8 currentRound, uint8 vcount, uint8 ucount)",

    "event ContestCreated(uint8 indexed contestId)",
    "event PlayerJoined(uint8 indexed contestId, uint8 indexed playerID)",
    "event ContestEnded(uint8 indexed contestId, address winner)"
  ];

  public nftAbi = [
    "function mintFromGame(uint8 contestId, string memory _tokenURI) public returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function balanceOf(address owner) view returns (uint256)"
  ];

  constructor(signer: ContractRunner) {
    this.gameContract = new ethers.Contract(this.gameAddress, this.gameAbi, signer);
    // this.nftContract = new ethers.Contract(this.nftAddress, this.nftAbi, signer);
  }

  private parseEvent(receipt: ethers.TransactionReceipt, eventName: string) {
    const iface = new ethers.Interface(this.gameAbi);
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() !== this.gameAddress.toLowerCase()) continue;
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === eventName) {
          return parsed.args;
        }
      } catch (err) {
        continue;
      }
    }
    return null;
  }

  /** ========== Game Contract Functions ========== **/

  async createContest(maxRounds: number, musicID: number) {
    const tx = await this.gameContract.createContest(maxRounds, musicID);
    const receipt = await tx.wait();
    const args = this.parseEvent(receipt, "ContestCreated");
    if (args) {
      console.log("Contest created with ID:", args.contestId.toString());
      this.joinContest(Number(args.contestId));
      this.joinContest(Number(args.contestId));
      this.joinContest(Number(args.contestId));
      this.joinContest(Number(args.contestId));
      return Number(args.contestId);
    }
    throw new Error("ContestCreated event not found.");
  }

  async joinContest(contestId: number) {
    const tx = await this.gameContract.joinContest(contestId);
    const receipt = await tx.wait();
    const args = this.parseEvent(receipt, "PlayerJoined");
    if (args) {
      console.log(`Player joined with ID:`, args.playerID.toString());
      return Number(args.playerID);
    }
    throw new Error("PlayerJoined event not found.");
  }

  async startContest(contestId: number) {
    const tx = await this.gameContract.startContest(contestId);
    await tx.wait();
  }

  async playCard(contestId: number, playerIndex: number, cardIndex: number) {
    const tx = await this.gameContract.playCard(contestId, playerIndex, cardIndex);
    await tx.wait();
  }

  async vote(contestId: number, voterIndex: number, suspectIndex: number) {
    const tx = await this.gameContract.vote(contestId, voterIndex, suspectIndex);
    await tx.wait();
  }

  async getContestCounter(): Promise<number> {
    const count = await this.gameContract.contestCounter();
    return Number(count);
  }

  async getContestDetails(contestId: number) {
    const contest = await this.gameContract.contests(contestId);
    return {
      creator: contest.creator,
      musicID: contest.musicID,
      numPlayer: contest.numPlayer,
      spy: contest.spy,
      maxRounds: contest.maxRounds,
      currentRound: contest.currentRound,
      vcount: contest.vcount,
      ucount: contest.ucount
    };
  }

  async isContestEnded(contestId: number): Promise<boolean> {
    const details = await this.getContestDetails(contestId);
    return details.currentRound > details.maxRounds;
  }

  /** ========== NFT Mint Functions ========== **/

  async mintNFT(contestId: number, musicMetadataUrl: string): Promise<number> {
    const tx = await this.nftContract.mintFromGame(contestId, musicMetadataUrl);
    const receipt = await tx.wait();
    const parsed = receipt.logs.find(log  => log.address.toLowerCase() === this.nftAddress.toLowerCase());
    if (!parsed) throw new Error("NFT Mint event not found!");

    console.log(`NFT minted for contest: ${contestId}`);
    return contestId;
  }

  async getOwnerOf(tokenId: number): Promise<string> {
    return await this.nftContract.ownerOf(tokenId);
  }

  async getBalanceOf(address: string): Promise<number> {
    const balance = await this.nftContract.balanceOf(address);
    return Number(balance);
  }
}
