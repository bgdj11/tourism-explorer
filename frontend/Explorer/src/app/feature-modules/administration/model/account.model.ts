export interface Account {
    id: number;
    username: number;
    email: string;
    role: number;
    isActive: boolean;
    isInvited?: boolean; // Novo polje
}