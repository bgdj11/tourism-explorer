export interface TourDTO {
    id: number;
    name: string;
    description: string;
    weight: string;
    tags: string[];
    status: number;
    price?: number;
    equipmentIds?: number[];
    tourCheckpointIds?: number[];
  }
  