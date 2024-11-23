import { Component, OnInit } from '@angular/core';
import { ClubDTO } from '../model/club.model';
import { TourManagementService } from '../tour-management.service'; 
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecutionService } from '../../tour-execution/tour.execution.service';
import { MembershipRequest, MemRequestStatus } from '../model/membershipRequest.model';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubsComponent implements OnInit {

  clubs: ClubDTO[] = [];
  currentUserId : number = 0;
  newClub: ClubDTO = { name: '', description: '', photo: '', ownerId: 0 };
  editingClub: ClubDTO | null = null;
  showAddClubForm: boolean = false;

  membershipRequests: MembershipRequest[] = [];
  tourists: any[] = [];
  showTouristListForClubId: number | null = null; // Prikazuje turiste za određeni klub
  filteredTourists: any[] = []; // Filtrirani turisti
  touristInvitedForClub: { [clubId: number]: { [touristId: number]: boolean } } = {};

  
  constructor(private service: TourManagementService,
    private authService : AuthService,
    private tourService : TourExecutionService,
  ) { }

  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.currentUserId = user.id;
    });

    this.getClubs(1, 10);
    this.getAllTourists();
    this.loadAllMembershipRequests(); 
  }

  loadAllMembershipRequests(): void {
    this.clubs.forEach(club => {
      this.loadMembershipRequestsForClub(club.id || 0);
    });
  }

  
  loadMembershipRequestsForClub(clubId: number): void {
    this.service.getMembershipRequests(clubId).subscribe(
      (response: { results: MembershipRequest[], totalCount: number }) => {
        console.log(`API response for club ${clubId}:`, response);
  
        if (Array.isArray(response.results)) {
          this.membershipRequests = response.results;
  
          if (!this.touristInvitedForClub[clubId]) {
            this.touristInvitedForClub[clubId] = {};
          }
  
          response.results.forEach(request => {
            if (this.service.isTouristInvited(request.clubId, request.senderId)) {
              this.touristInvitedForClub[clubId][request.senderId] = true;
            }
          });
  
          console.log('Tourists invited for club:', this.touristInvitedForClub);
        } else {
          console.error(`Error: Expected 'results' to be an array but got:`, response.results);
        }
      },
      (error) => {
        console.error(`Error fetching membership requests for club ${clubId}:`, error);
      }
    );
  }
  
  
  
  
  

  toggleAddClubForm(): void {
    this.showAddClubForm = !this.showAddClubForm;
  }

  toggleTouristList(clubId: number): void {
    if (this.showTouristListForClubId === clubId) {
      this.showTouristListForClubId = null; // Zatvori listu ako je već otvorena
    } else {
      this.showTouristListForClubId = clubId;
      this.loadMembershipRequestsForClub(clubId); // Učitaj zahteve za ovaj klub
      this.filteredTourists = this.tourists.filter(t => t.id !== this.currentUserId);
    }
  }
  
  
  inviteTourist(tourist: any, clubId: number): void {
    const membershipRequest: MembershipRequest = {
      senderId: tourist.id,  // ID turiste kojem šaljemo poziv
      ownerId: this.currentUserId,  // Vlasnik kluba
      status: MemRequestStatus.Invited, // Status poziva
      clubId: clubId // ID kluba
    };
  
    this.service.createMembershipRequest(clubId, membershipRequest).subscribe(
      response => {
        console.log('Membership request created successfully:', response);
        alert(`Invitation sent to ${tourist.username}`);
        // Kada je poziv poslat, postavite turistu kao pozvanog
        this.touristInvitedForClub[clubId][response.senderId] = true;
      },
      error => {
        console.error('Error creating membership request:', error);
      }
    );
  }
  

  

  getAllTourists(): void {
    this.tourService.getAllTourists().subscribe(
      response => {
        this.tourists = response.filter(t => t.id !== this.currentUserId); // Ukloni trenutno ulogovanog
      },
      error => {
        console.error('Error fetching tourists:', error);
      }
    );
  }
  
  
  addTouristToClub(): void {
    this.getAllTourists();
  }
    

  getClubs(page: number, pageSize: number): void {
    this.service.getClubs(page, pageSize).subscribe(response => {
      this.clubs = response.results;
      this.loadAllMembershipRequests();

    });
  }

    addClub(){
      if (this.currentUserId) {
        this.newClub.ownerId = this.currentUserId;

      this.service.createClub(this.newClub).subscribe(
        response => {
          console.log('Club added successfully', response);
          this.newClub = {name: '', description: '', photo: '', ownerId: this.currentUserId};
        },
        error => {
          console.error('Error creating club:', error);
        }
        
        
      )
    }
  }
    

  deleteClub(id: number): void {
    this.service.deleteClub(id).subscribe(() => {
      console.log('Club deleted');
      this.getClubs(1, 10);
    });
  } 

  editClub(club: ClubDTO): void {
    this.editingClub = { ...club };  
  }

  updateClub(): void {
    if (this.editingClub && this.editingClub.ownerId === this.currentUserId) {
      this.service.updateClub(this.editingClub).subscribe(
        response => {
          console.log('Club updated successfully', response);
          this.editingClub = null;  
          this.getClubs(1, 10);  
        },
        error => {
          console.error('Error updating club:', error);
        }
      );
    } else {
      console.error('You are not authorized to update this club.');
    }
  }
  
  addTourist(clubId: number): void {
    console.log(`Adding tourist to club with ID: ${clubId}`);
    // Dodajte logiku za dodavanje turiste ovde
  }

  isTouristInClub(touristId: number, clubId: number): boolean {
    const requestsForClub = this.membershipRequests.filter(
      (req) => req.clubId === clubId && req.status === MemRequestStatus.Accepted
    );
    return requestsForClub.some((req) => req.senderId === touristId);
  }
  
  removeTouristFromClub(senderId: number,clubId: number): void {
    this.service.getClubById(clubId).subscribe(
      (club) => {
        const ownerId = club.ownerId; // Pristupite ownerId kluba
        
        this.service.getMembershipRequests(clubId).subscribe(
          (response: { results: MembershipRequest[]; totalCount: number }) => {
            const requests = response.results; // Izdvojite niz zahteva
            
            const matchedRequest = requests.find(
              (request) =>
                request.ownerId === ownerId && // Poređenje sa vlasnikom kluba
                request.senderId === senderId &&
                request.status === 2 // Proverite da li status odgovara
            );
    
            if (matchedRequest) {
              console.log('Matched Request:', matchedRequest);
              this.service.deleteMembershipRequest(clubId, matchedRequest.id || 0).subscribe({
                next:(_) => {
                  console.log('Matched Request:', matchedRequest.id);
                },
                error: (err) => {
                  console.log('Error occured: ', err); 
                }
              }
              );
              alert('Membership request removed successfully.');
              console.log('Membership request removed successfully.');
              this.loadMembershipRequestsForClub(clubId);
            } else {
              console.warn('No matching request found.');
            }
          },
          (error) => {
            console.error('Error fetching membership requests:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching club by ID:', error);
      }
    );    
  }    
  
  isTouristPendingOrAcceptedOrRejected(touristId: number, clubId: number): boolean {
    const requestsForClub = this.membershipRequests.filter(req => req.clubId === clubId);
    return requestsForClub.some(req => 
      req.senderId === touristId && 
      (req.status === MemRequestStatus.Pending || req.status === MemRequestStatus.Accepted || req.status === MemRequestStatus.Rejected)
    );
  }
  
  


}  