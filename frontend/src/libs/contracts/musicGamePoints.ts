import { ContractRunner, ethers } from 'ethers';

export class MusicGameContract {
  public contract: ethers.Contract;
  public contractAddress: string = "0x5DF2994dba199fd1b65555eb7A0c64Dec5175596";
  public abi = [
    "function createContest(uint8 maxRounds) public",
    "function joinContest(uint8 contestId) public",
    "function startContest(uint8 contestId) public",
    "function playCard(uint8 contestId, uint8 playerIndex, uint8 cardIndex) public",
    "function vote(uint8 contestId, uint8 voterIndex, uint8 suspectIndex) public",
    "function contestCounter() view returns (uint8)",
    "function contests(uint8 contestId) view returns (address creator, uint8 maxRounds, uint8 currentRound, bool started, bool submitted)"
  ];

  constructor(signer: ContractRunner) {
    this.contract = new ethers.Contract(this.contractAddress, this.abi, signer);
  }

  private parseEvent(logs: ethers.Log[], eventName: string) {
    for (const log of logs) {
      try {
        const parsed = this.contract.interface.parseLog(log);
        if (parsed?.name === eventName) {
          return parsed.args;
        }
      } catch (err) {
        continue; // not parsable, skip
      }
    }
    return null;
  }

  async createContest(maxRounds: number, maxPlayers: number) {
    const tx = await this.contract.createContest(maxRounds);
    const receipt = await tx.wait();
    const args = this.parseEvent(receipt.logs, "ContestCreated");
    if (args) {
      console.log("Contest Created with ID:", args.contestId.toString());
      return args.contestId;
    }
    throw new Error("ContestCreated event not found.");
  }

  async joinContest(contestId: number) {
    const tx = await this.contract.joinContest(contestId);
    const receipt = await tx.wait();
    const args = this.parseEvent(receipt.logs, "PlayerJoined");
    if (args) {
      console.log(`Player ${args.player} joined contest ${args.contestId}`);
      return args;
    }
    throw new Error("PlayerJoined event not found.");
  }

  async startContest(contestId: number) {
    const tx = await this.contract.startContest(contestId);
    const receipt = await tx.wait();
    const args = this.parseEvent(receipt.logs, "ContestStarted");
    if (args) {
      console.log(`Contest ${args.contestId} started!`);
      return args;
    }
    throw new Error("ContestStarted event not found.");
  }

  async playCard(contestId: number, playerIndex: number, cardIndex: number) {
    const tx = await this.contract.playCard(contestId, playerIndex, cardIndex);
    const receipt = await tx.wait();
    const args = this.parseEvent(receipt.logs, "RoundSubmitted");
    if (args) {
      console.log(`Round submission by ${args.player} in contest ${args.contestId}`);
      return args;
    }
    throw new Error("RoundSubmitted event not found.");
  }

  async vote(contestId: number, voterIndex: number, suspectIndex: number) {
    const tx = await this.contract.vote(contestId, voterIndex, suspectIndex);
    const receipt = await tx.wait();
    const args = this.parseEvent(receipt.logs, "RoundVoted");
    if (args) {
      console.log(`Vote by ${args.voter} in contest ${args.contestId}`);
      return args;
    }
    throw new Error("RoundVoted event not found.");
  }

  // ========== Additional Getter Functions ==========

  async getContestCounter(): Promise<number> {
    const count = await this.contract.contestCounter();
    return Number(count);
  }

  async getContestDetails(contestId: number) {
    const contest = await this.contract.contests(contestId);
    return {
      creator: contest.creator,
      maxRounds: contest.maxRounds,
      currentRound: contest.currentRound,
      started: contest.started,
      submitted: contest.submitted
    };
  }

  async getContestCreator(contestId: number): Promise<string> {
    const details = await this.getContestDetails(contestId);
    return details.creator;
  }

  async isContestStarted(contestId: number): Promise<boolean> {
    const details = await this.getContestDetails(contestId);
    return details.started;
  }

  async isEveryoneSubmitted(contestId: number): Promise<boolean> {
    const details = await this.getContestDetails(contestId);
    return details.submitted;
  }

  async getCurrentRound(contestId: number): Promise<number> {
    const details = await this.getContestDetails(contestId);
    return Number(details.currentRound);
  }

  async getPlayers(contestId: number): Promise<string[]> {
    const players: string[] = [];
    for (let i = 0; i < 15; i++) {
      try {
        const player = await this.contract.contests(contestId).players(i); // players is a mapping
        if (player !== ethers.constants.AddressZero) {
          players.push(player);
        }
      } catch (err) {
        break; // No more players
      }
    }
    return players;
  }
}
