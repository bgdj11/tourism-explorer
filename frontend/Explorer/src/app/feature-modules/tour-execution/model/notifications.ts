export interface NotificationDto {
    id: number;
    senderId: number;
    followerId: number;
    messageId: number;
    isRead: boolean;
    message: MessageDto;
  }

  import { ResourceType } from "./message-request";
  
  export interface MessageDto {
    id: number;
    senderId: number;
    content: string;
    resourceUrl?: string;
    resourceType?: ResourceType | null;  
  }
  