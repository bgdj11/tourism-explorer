export interface ShoppingCartDTO {
  id?: number;
  touristId: number;
  shopingItems: ShoppingCartItemDTO[];  
  shopingBundles: ShoppingCartBundleDTO[];  
  totalPrice: number;
  shopItemsCapacity?: number;
}

export interface ShoppingCartItemDTO {
  id?: number;
  tourId: number;
  tourName: string;
  tourPrice: number;
}

export interface ShoppingCartBundleDTO {
  id?: number;         // ID paketa
  bundleId: number;   // ID paketa iz backend-a
  name: string;       // Naziv paketa
  price: number;      // Cena pa
}
