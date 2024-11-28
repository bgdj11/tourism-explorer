export interface Encounter {
  id?: number; // ID može biti opcionalan jer možda ne postoji prilikom kreiranja novog Encounter-a
  name: string; // Naziv Encounter-a
  description: string; // Opis Encounter-a
  location: {
    latitude: number;
    longitude: number;
  };
  xp: number; // XP vrednost (Experience Points)
  status: string; // Status Encounter-a
  type: string; // Tip Encounter-a
  publishedDate?: Date; // Datum objavljivanja (opcionalno jer možda nije objavljen odmah)
  archivedDate?: Date; // Datum arhiviranja (opcionalno)
  authorId: number; // ID autora koji je kreirao Encounter
  image?: string; // Slika za hidden encounter
  isReviewed: boolean;
}

export enum EncounterStatus {
  DRAFT = 'DRAFT', // Encounter je u fazi draft-a
  ACTIVE = 'ACTIVE', // Encounter je aktivan
  ARCHIVED = 'ARCHIVED', // Encounter je arhiviran
}

export enum EncounterType {
  SOCIAL = 'SOCIAL', // Društveni Encounter
  LOCATION = 'LOCATION', // Lokacijski Encounter
  MISC = 'MISC', // Ostalo
}
