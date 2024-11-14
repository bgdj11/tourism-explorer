import { Equipment } from "../../administration/model/equipment.model";
import { CheckpointDTO } from "./checkpoint.model";
import { EquipmentDTO } from "./equipment.model";
import { TravelTimeDTO } from "./travelTime.model";

export interface TourDTO {
  id: number;
  name: string;
  description: string;
  weight: string;
  tags: string[];
  status: number; // Pretpostavka: status je broj koji predstavlja enum vrednost sa backend-a
  price?: number;
  lengthInKm?: number;
  publishedDate?: Date;
  archivedDate?: Date;
  equipments?: EquipmentDTO[];
  tourCheckpoints?: CheckpointDTO[];
  travelTimes?: TravelTimeDTO[];
}
