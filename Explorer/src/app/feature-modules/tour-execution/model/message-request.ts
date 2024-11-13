export interface SendMessageRequest {
    senderId: number;
    followerId: number;
    content: string;
    resourceUrl?: string;
    resourceType?: ResourceType | null;  
  }

  export enum ResourceType {
    Tour = 'Tour',
    Blog = 'Blog'
  }
  