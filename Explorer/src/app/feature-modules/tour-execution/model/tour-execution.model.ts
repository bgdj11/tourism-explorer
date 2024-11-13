// tour-execution.model.ts
import {VisitedCheckpointsDTO} from "./visitedCheckpoints.model";

export interface TourExecution {
  id: number;
  tourId: number;
  userId: number;
  startTime?: Date; // ISO string format za datum i vreme
  endTime?: Date; // ISO string format, može biti undefined ako tura još traje
  lastActivity?: Date;
  visitedCheckpoints: VisitedCheckpointsDTO[];
  status: TourExecutionStatus; // Status ture (IN_PROGRESS, COMPLETED, ABANDONED)
}

// Enum za status ture
export enum TourExecutionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}
