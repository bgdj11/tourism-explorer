export interface TourProblem {
    id?: number;
    touristId: number;
    tourId: number;
    authorId: number;
    category: string;
    priority: string;
    description:string;
    reportedAt: Date;
    resolved: boolean;
    problemComments: ProblemComment[];
    resolvingDue?: Date;
    closed: boolean;
  }

  export interface ProblemComment {
    id?: number;
    text: string;
    userId: number;
    tourProblemId: number;
    commentedAt: Date;
  }