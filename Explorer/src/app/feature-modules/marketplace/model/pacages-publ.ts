export interface BundleDTO {
    id: number;
    name: string;
    customPrice: number;
    totalToursPrice: number;
    publishedDate?: Date;
    archivedDate?: Date;
    authorId: number;
    status: number;
    tours: BundleTourDTO[];
  }
  
  export interface BundleTourDTO {
    tourId: number;
    name: string;
    price: number;
    bundleId: number;
  }