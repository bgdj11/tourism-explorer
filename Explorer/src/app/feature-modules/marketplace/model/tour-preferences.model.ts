export enum DifficultyLevel {
    Easy = 'EASY',
    Medium = 'MEDIUM',
    Hard = 'HARD'
}
export interface TourPreferences {
    id: number, 
    difficulty: DifficultyLevel,
    walkRating: number, 
    bikeRating: number, 
    carRating: number, 
    boatRating: number,
    interestTags: string[]
}