export interface TourDTO {
  id: number;
  name: string;
  description: string;
  weight: string;
  tags: string[];
  price?: number;
  equipmentIds: number[];
}
