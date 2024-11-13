export interface Blog{
    id? : number,
    userId? : number,
    title : string,
    description : string,
    createdDate? : string,
    images: string[],
    status : BlogStatus,
    votes : Vote[],
    voteStatus: VoteStatus,
    blogStatus: Status,
    votes : Vote[]
}

export enum BlogStatus {
    Draft = 0,
    Published = 1,
    Closed = 2
  }

export enum Status {
    None,
    ReadOnly,
    Active,
    Famous
}

  
export enum Markdown {
    Upvote = 0,
    Downvote = 1
}

export enum VoteStatus {
    None = 0,
    ReadOnly = 1,
    Active = 2,
    Famous = 3
}

export interface Vote {
    userId?: number;
    blogId?: number;
    mark: Markdown;
    createdDate?: string;
}


