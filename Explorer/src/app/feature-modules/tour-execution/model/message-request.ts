export interface SendMessageRequest {
    id?: number;
    senderId: number;
    followerId: number;
    content: string;
    resourceUrl?: string;
    resourceType?: ResourceType | null; 
    clubId?: number;
  }

  export enum ResourceType {
    Tour = 0,
    Blog = 1,
    Club = 2
  }
  