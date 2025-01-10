import { Equipment } from "../../administration/model/equipment.model";
import { AccomodationDTO } from "./accomodation.model";
import { CheckpointDTO } from "./checkpoint.model";
import { DailyAgendaDTO } from "./DailyAgendaDTO.model";
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
  dailyAgendas?: DailyAgendaDTO[];
  accomodations?: AccomodationDTO[];
  authorId: number;
}
