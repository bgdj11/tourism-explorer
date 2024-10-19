export interface Comment{
    id: number;
    blogId: number;
    userId: number;
    creationTime: Date;
    lastModifiedTime: Date;
    text: string;
}