export interface TourDTO {
  id: number;
  name: string;
  description: string;
  weight: string;
  tags: string[];
  status: number; // Pretpostavka: status je broj koji predstavlja enum vrednost sa backend-a
  price?: number;
  lengthInKm: number; // Dodatno polje za dužinu ture u kilometrima
  publishedDate: string; // ISO string format za datume
  archivedDate: string;  // ISO string format za datume
  equipmentIds?: number[]; // Lista ID-ova opreme
  tourCheckpointIds?: number[]; // Lista ID-ova tačaka ture
}
