export enum MemRequestStatus {
    None = 0,
    Pending = 1,
    Accepted = 2,
    Rejected = 3,
    Invited = 4
  }
  
export interface MembershipRequest {
    id?: number; // Opcionalno, jer će backend generisati
    senderId: number;
    ownerId: number;
    status: MemRequestStatus;
    clubId: number;
}
  