export interface TouristProfile {
  id: number; // Unique identifier
  username: string; // Tourist's username
  xp: number; // Current XP
  level: number; // Calculated level
  completedEncountersIds: number[]; // List of completed encounter IDs
}
