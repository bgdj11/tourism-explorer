import { UserDto } from "src/app/feature-modules/tour-execution/model/all-tourists";
import { User } from "src/app/infrastructure/auth/model/user.model";


export interface EncounterDTO {
  id: number;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  xp: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  type: 'SOCIAL' | 'LOCATION' | 'MISC';
  publishedDate?: string; // JSON datumi se obično parsiraju kao string
  archivedDate?: string;
  authorId: number;
  usersWhoCompletedId: number[];
}
