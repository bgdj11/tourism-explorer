export interface ShoppingCartDTO {
    id?: number;
    touristId: number;
    shopingItems: ShoppingCartItemDTO[];  // Promenili smo naziv na "shopingItems"
    totalPrice: number;
    shopItemsCapacity?: number;
  }
  
  export interface ShoppingCartItemDTO {
    id?: number;
    tourId: number;
    tourName: string;
    tourPrice: number;
  }
  