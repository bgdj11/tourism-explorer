export interface EncounterDTO {
  id: number;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  xp: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  type: 'SOCIAL' | 'LOCATION' | 'MISC';
  publishedDate?: string; // JSON datumi se obično parsiraju kao string
  archivedDate?: string;
  authorId: number;
}
