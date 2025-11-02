export interface CheckpointDTO {
  id: number;
  latitude?: number;
  longitude?: number;
  checkpointName?: string;
  checkpointDescription?: string;
  image?: string;
  secret?: string;
}
