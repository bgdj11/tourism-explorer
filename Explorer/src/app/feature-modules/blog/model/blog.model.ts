export interface Blog{
    id? : number,
    userId? : number,
    title : string,
    description : string,
    createdDate? : string,
    images: string[],
    status : BlogStatus,
    votes : Vote[]
}

export enum BlogStatus {
    Draft = 0,
    Published = 1,
    Closed = 2
  }
  
export enum Markdown {
    Upvote = 0,
    Downvote = 1
}

export interface Vote {
    userId?: number;
    blogId?: number;
    mark: Markdown;
    createdDate?: string;
}


