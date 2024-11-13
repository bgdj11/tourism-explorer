export interface UserDto {
    id?: number;        
    username: string;
    password?: string;
    role: UserRole;
    isActive: boolean;
}

export enum UserRole {
    Administrator = "Administrator",
    Author = "Author",
    Tourist = "Tourist"
}