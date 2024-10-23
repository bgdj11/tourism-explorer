export enum DifficultyLevel {
  Easy = 1,
  Medium = 2,
  Hard = 3
}
  
export interface TourPreferences {
    id?: number, 
    difficulty: DifficultyLevel,
    walkRating: number, 
    bikeRating: number, 
    carRating: number, 
    boatRating: number,
    interestTags: string[]
}