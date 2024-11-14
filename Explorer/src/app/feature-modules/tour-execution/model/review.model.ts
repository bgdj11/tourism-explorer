import {Equipment} from "./my-equipment.model";

export interface TourReview {
  id: number;
  rating: number;
  comment: string;
  personn: Person;
  tourDate: Date;
  reviewDate: Date;
  images: string[];
  tour: Tour;
}

export interface Tour {
  id: number;
  name: string;
  description: string;
  weight: string;
  tags: string[];
  status: number;
  price: number | undefined;
  lengthInKm: number;
  equipments: Equipment[];
  tourCheckpoints: [];
}

export interface Person {
  userId: number;
  name: string;
  email: string;
  surname: string;
}
