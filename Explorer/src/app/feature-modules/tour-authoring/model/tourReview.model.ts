import { Person } from "./person.model";
import { TourDTO } from "./tour.model";

export interface TourReviewDTO {
    id: number;
    rating: number;

    comment: string;
    personn: Person;
    tourDate: Date;
    reviewDate: Date;
    images: string[];
    tour: TourDTO;
}