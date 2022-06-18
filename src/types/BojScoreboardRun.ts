interface BojScoreboardRunBase {
  id: number;
  problem: number;
  result: number;
  frozen: false;
  team: number;
  time: number;
}

export type BojScoreboardRun<T extends 0 | 1 = 0> = T extends 0
  ? BojScoreboardRunBase
  : BojScoreboardRunBase & { partial: 0 | 1; score: number };
