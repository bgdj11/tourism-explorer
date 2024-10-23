export interface Blog{
    id? : number,
    userId? : number,
    title : string,
    description : string,
    createdDate? : string,
    images: string[],
    status : BlogStatus
}

export enum BlogStatus {
    Draft = 0,
    Published = 1,
    Closed = 2
  }
  