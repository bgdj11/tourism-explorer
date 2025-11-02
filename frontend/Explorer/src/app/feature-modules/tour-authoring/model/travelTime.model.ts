export interface TravelTimeDTO {
    //id: number;
    time: number;
    transportType: number;
  }

  export enum TransportType {
    Walk = 1,
    Car = 2,
    Bike = 3
  }