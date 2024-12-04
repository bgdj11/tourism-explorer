export interface TourSale {
    id?: number;
    tours: number[];
    startDate: Date;
    endDate: Date;
    active: boolean;
    discount: number;
    authorId: number;
}