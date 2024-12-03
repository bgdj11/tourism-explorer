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

  currentTouristId: number = 0;
  filteredRequests: MembershipRequest[] = []; //sadrzace sve zahtjeve koji se odnose na trenuto prijavljenog turistu, bilo da ih je poslao turista vlasniku, ili su poziv od vlasnika(invitations)
  invitationsToJoin: MembershipRequest[] = [];
  isWithdrawn: boolean = false;
  acceptedRequests: MembershipRequest[] = []; // Lista zahtjeva koje je turista prihvatio

  constructor(private authService: AuthService, private service: TourManagementService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentTouristId = user?.id || 0;
      this.loadAllClubsToApplyFor();
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clubs']) {
      console.log('Clubs updated:', this.clubs);
      this.loadAllClubsToApplyFor();
    }
  }

  loadAllClubsToApplyFor(): void {
    const requests$ = this.clubs.map(club => {
      if (club.id === undefined) {
        console.log('Club ID is missing');
        return [];
      }
  
      return this.service.getMembershipRequests(club.id).pipe( //emitovane podatke
        map(requestsForClub => requestsForClub.results.filter(req => req.senderId === this.currentTouristId )) //filtrira samo one koji se odnose na trenutnog turistu
      ); // svaki Observable ->filtrirani zahtjev , ce biti niz sa po jednim elementom 
    }); //requests$ sadrži Observables sa filtriranim zahtevima za članstvo //kombinuje sve observable u observables
    //Svaki Observable u requests$ nakon filtriranja može emitovati prazan niz (ako nema zahteva za tog turistu) ili niz sa jednim zahtevom.
  
    forkJoin(requests$).subscribe((allRequests: MembershipRequest[][]) => { //allrequests ce biti niz gdje svaki element odgovara filtriranom zahtjevu za jedan klub
      const filtered = allRequests.flat().filter(req => req !== undefined); //uklanja prazne nizove koje emituju Observable u requests$ ako nema zahtjeva za turistu u tom klubu
      this.filteredRequests = filtered.filter(req => req.status === MemRequestStatus.Pending);
      this.invitationsToJoin = filtered.filter(req => req.status === MemRequestStatus.Invited);
      this.acceptedRequests = filtered.filter(req => req.status === MemRequestStatus.Accepted);
      console.log('Filtered Requests:', this.filteredRequests);
      console.log('Invitations to Join:', this.invitationsToJoin);  
    });
  }
  
  hasInvitationForClub(clubId: number | undefined): boolean{
    if(clubId === undefined){
      console.log('Club ID is undefined.');
      return false;
    }
    //console.log('pozivnica: ', this.invitations);
    return this.invitationsToJoin.some(invitation => invitation.clubId === clubId); //invitationToJoin je filtrirana i sadrzi samo pozive koji su upuceni current Tourist
  }

  hasJoinedTheClub(clubId: number | undefined):boolean{
    if(clubId === undefined){
      console.log('Club ID is undefined.');
      return false;
    }
    return this.acceptedRequests.some(req => req.clubId === clubId);
  }

  acceptInvitation(clubId: number | undefined): void {
    if(clubId === undefined){
      console.log('Club ID is undefined.');
      return;
    }
    const invitation = this.invitationsToJoin.find(inv => inv.clubId === clubId);
    if (invitation) {
      invitation.status = MemRequestStatus.Accepted;
      this.service.updateMembershipRequest(clubId, invitation).subscribe(() => {
        console.log('The invitation for club with ID: ', clubId, 'is accepted');
        alert('You accepted the invitation for club.');
        this.loadAllClubsToApplyFor(); // Osvježava prikaz klubova
      });
    }
  }
  
  rejectInvitation(clubId: number | undefined): void {
    if(clubId === undefined){
      console.log('Club ID is undefined.');
      return;
    }
    const invitation = this.invitationsToJoin.find(inv => inv.clubId === clubId);
    if (invitation) {
      this.service.deleteMembershipRequest(clubId, invitation.id!).subscribe(() => {
        //invitation.status = MemRequestStatus.Rejected;
        console.log('The invitation for club with ID: ', clubId, 'is rejected.');
        alert('You rejected the invitation for club.');
        this.loadAllClubsToApplyFor();
      });
    }
  }
  

  sendJoinRequest(clubId: number | undefined): void{ //turista salje vlasniku zahtjev za uclanjenje 
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
        this.loadAllClubsToApplyFor();
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
          this.loadAllClubsToApplyFor();
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
