export interface Problem {
    id?: number;
    userId: string;
    tourId: string;
    category: string;
    priority: string;
    description: string;
    reportedAt: Date;
}
