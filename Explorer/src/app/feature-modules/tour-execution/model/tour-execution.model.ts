// tour-execution.model.ts
export interface TourExecution {
  id: number;
  tourId: number;
  userId: number;
  startTime: string; // ISO string format za datum i vreme
  endTime?: string; // ISO string format, može biti undefined ako tura još traje
  status: TourExecutionStatus; // Status ture (IN_PROGRESS, COMPLETED, ABANDONED)
}

// Enum za status ture
export enum TourExecutionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}
