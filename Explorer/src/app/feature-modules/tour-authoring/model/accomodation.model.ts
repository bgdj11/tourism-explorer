export interface AccomodationDTO {
    id: number;
    name: string;
    description: string;
    images: string[];
    latitude: number;
    longitude: number;
    category: string;
    contactNumber: string;
    city: string;

}

export enum AccomodationType {
    HOTEL = 'HOTEL', // Društveni Encounter
    APPARTMENT = 'APPARTMENT', // Lokacijski Encounter
    HOUSE = 'HOUSE', // Ostalo
  }