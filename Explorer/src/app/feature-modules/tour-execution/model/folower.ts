export interface FollowerDto {
    id: number; // ID pratioca
    username: string; // Korisničko ime
    role: UserRole; // Uloga
    isActive: boolean; // Status
}

export enum UserRole {
    Administrator = "Administrator",
    Author = "Author",
    Tourist = "Tourist"
}