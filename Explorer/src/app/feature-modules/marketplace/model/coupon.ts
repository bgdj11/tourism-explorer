export interface Coupon {
    id?: number;
    code: string;
    discountPercentage: number;
    expiryDate?: string;
    tourId?: number;
    authorId: number;
  }
  