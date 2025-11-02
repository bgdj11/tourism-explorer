import { BundleTourDTO } from "./bundleTour.model";

export interface BundleDTO {
    id: number;
    name: string;
    customPrice: number;
    totalToursPriceCalculated: number;
    publishedDate?: Date;
    archivedDate?: Date;
    authorId: number;
    status: number;
    tours?: BundleTourDTO[];

  }