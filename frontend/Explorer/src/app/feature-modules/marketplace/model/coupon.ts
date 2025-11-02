export interface Coupon {
    id?: number;
    code: string;
    discountPercentage: number;
    expiryDate?: string;
    tourId?: number;
    tourName?: string;
    authorId?: number;
    recipientId?: number;
    isPublic: boolean;
  }
  