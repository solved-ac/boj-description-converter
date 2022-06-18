import { BojScoreboardTeam } from "./BojScoreboardTeam";

export interface Team extends BojScoreboardTeam {
  score: number;
  penalty: number;
}
