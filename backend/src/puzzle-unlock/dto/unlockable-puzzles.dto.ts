export class UnlockablePuzzlesDto {
  unlockablePuzzleIds: string[];
  
  constructor(unlockablePuzzleIds: string[] = []) {
    this.unlockablePuzzleIds = unlockablePuzzleIds;
  }
}
