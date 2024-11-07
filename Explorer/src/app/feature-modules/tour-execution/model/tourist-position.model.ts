export class MapLocationDto {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

export class TouristPositionDto {
  id: number;
  touristId: number;
  currentLocation: MapLocationDto;

  constructor(id: number, touristId: number, currentLocation: MapLocationDto) {
    this.id = id;
    this.touristId = touristId;
    this.currentLocation = currentLocation;
  }
}
