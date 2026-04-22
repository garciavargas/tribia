import { GroupKey } from "@/constants/groups";

export interface Match {
  id: string;
  group: GroupKey;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: "scheduled" | "live" | "finished";
}

export type PredictionResult = "home" | "draw" | "away";

export interface MatchPrediction {
  matchId: string;
  prediction: PredictionResult;
}

export interface GroupPrediction {
  group: GroupKey;
  firstPlace: string;
}
