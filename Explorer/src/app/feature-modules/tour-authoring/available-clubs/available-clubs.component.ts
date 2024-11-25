import { Component, Input, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { ClubDTO } from '../model/club.model';
import { MembershipRequest, MemRequestStatus } from '../model/membershipRequest.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourManagementService } from '../tour-management.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'xp-available-clubs',
  templateUrl: './available-clubs.component.html',
  styleUrls: ['./available-clubs.component.css']
})
export class AvailableClubsComponent {
  @Input() clubs: ClubDTO[] = [];
  @Input() membershipRequests: MembershipRequest[] = [];

  currentTouristId: number = 0;
  filteredRequests: MembershipRequest[] = [];
  isWithdrawn: boolean = false;

  constructor(private authService: AuthService, private service: TourManagementService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentTouristId = user?.id || 0;
    });
    this.loadAllMembershipRequests();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Provera da li `membershipRequests` postoji u promenama i da li `currentTouristId` nije 0
    if (changes['membershipRequests']) {
      this.loadAllMembershipRequests();
    }
  }

  loadAllMembershipRequests(): void {
    const requests$ = this.clubs.map(club => {
      if (club.id === undefined) {
        console.log('Club ID is missing');
        return [];
      }
  
      return this.service.getMembershipRequests(club.id).pipe(
        map(requestsForClub => requestsForClub.results.filter(req => req.senderId === this.currentTouristId))
      );
    });
  
    forkJoin(requests$).subscribe((allRequests: MembershipRequest[][]) => {
      const filtered = allRequests.flat().filter(req => req !== undefined);
      this.filteredRequests = filtered;
      console.log('Filtered Requests:', this.filteredRequests);  
    });
  }
  

  sendJoinRequest(clubId: number | undefined): void{
    if(clubId === undefined){
      console.log('Club ID is undefined.');
      return;
    }
    if(!this.currentTouristId){
      alert('Please log in to send a request.');
      return;
    }

    const club = this.clubs.find(club => club.id === clubId);
    if(club){
      const request: MembershipRequest = {
        senderId: this.currentTouristId,
        ownerId: club.ownerId, 
        clubId: clubId,
        status: MemRequestStatus.Pending,   
      };
      this.sendTouristsMemRequest(request);


    } else{
      console.log('Club not found.');
    }
    
  }
  //Request from tourist to join a club 
  sendTouristsMemRequest(membershipRequest: MembershipRequest): void {

    this.service.createMembershipRequest(membershipRequest.clubId, membershipRequest).subscribe(
      response => {
        console.log('Membership request sent successfully: ', response);
        alert('Membership request sent successfully.');
        this.filteredRequests.push(membershipRequest);
      },
      error => {
        console.log('Error sending membership request: ', error);
      }
    );
  }

  withdrawMembershipRequest(clubId: number | undefined): void{
    if(clubId === undefined){
      console.log('Club ID is undefined.');
      return;
    }
    if(!this.currentTouristId){
      alert('Please log in to send a request.');
      return;
    }
    const requestToWithdraw = this.filteredRequests.find(req => req.clubId === clubId && req.senderId===this.currentTouristId);
    if(requestToWithdraw?.id !== undefined){
      this.service.deleteMembershipRequest(clubId, requestToWithdraw.id).subscribe(
        () => {
          console.log('Membership request withdrawn successfully.');
          alert('Membership request withdrawn successfully.');
          this.filteredRequests = this.filteredRequests.filter(req => req.id !== requestToWithdraw.id); // Uklanjanje iz liste
        },
        (error) => {
          console.log('An error occured trying to withdraw the request.');
        }
      );
    }else {
      console.log('Request ID is missing.');
    }
  }

  hasRequestSent(clubId: number): boolean{
    return this.filteredRequests.some(req => req.clubId === clubId && req.status === MemRequestStatus.Pending)
  }

}
