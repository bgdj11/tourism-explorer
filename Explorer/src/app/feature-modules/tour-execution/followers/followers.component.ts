import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour.execution.service';
import { UserDto } from '../model/all-tourists';
import { FollowersDto } from '../model/followers';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { SendMessageRequest } from '../model/message-request';
import { NotificationDto } from '../model/notifications';
import { ResourceType } from '../model/message-request';

@Component({
  selector: 'xp-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  followedTourists: UserDto[] = []; // Lista korisnika koje pratimo
  nonFollowedTourists: UserDto[] = []; 
  showMessageForm: boolean = false; // Dodaj ovo u klasu
  currentUserId: number;  // Property za ID korisnika
  selectedFollowerId: number | null = null; // ID selektovanog pratioca
  messageSubject: string = ''; // Naslov poruke
  messageBody: string = ''; // Telo poruke
  resourceUrl: string = '';
  //ResourceType = ResourceType;
  //resourceType: ResourceType | '' = '';

  notifications: NotificationDto[] = []; // Lista notifikacija


  constructor(private service: TourExecutionService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id; // Skladištimo ID trenutnog korisnika
        this.getNotifications(); // Dohvatimo notifikacije odmah kad imamo ID

      }
    });
    this.getFollowedTourists(); // Učitaj pratile turiste
    this.getNonFollowedTourists(); // Učitaj nepraćene turiste
  }

  getFollowedTourists(): void {
    this.service.getFollowedUsers().subscribe(
      (data: UserDto[]) => {
        this.followedTourists = data; // Postavi rezultate na niz followedTourists
        if (this.followedTourists.length === 0) {
          console.warn('Nema korisnika koje pratite.');
        }
      },
      (error: any) => { // Dodajemo tip za error
        console.error('Greška prilikom dobijanja pratilaca:', error); // Obrada greške
      }
    );
  }

  getNonFollowedTourists(): void {
    this.service.getNonFollowedTourists().subscribe(
      (data: UserDto[]) => {
        this.nonFollowedTourists = data; // Postavlja rezultate u nonFollowedTourists
        if (this.nonFollowedTourists.length === 0) {
          console.warn('Nema korisnika koje trenutni korisnik ne prati.');
        }
      },
      (error: any) => { // Dodajemo tip za error
        console.error('Greška prilikom dobijanja korisnika koje ne pratite:', error);
      }
    );
  }

  // Nova metoda za započinjanje praćenja
  createFollower(touristId: number): void {
    const followDto: FollowersDto = {
      followerId: 0, 
      followingId: touristId 
    };

    this.service.createFollower(followDto).subscribe(
      response => {
        console.log('Uspešno ste zapratili korisnika:', response);
        this.getFollowedTourists(); // Ponovo učitajte pratile
        this.getNonFollowedTourists(); // Ponovo učitajte korisnike koje ne pratite
      },
      (error: any) => { // Dodajemo tip za error
        console.error('Greška prilikom praćenja korisnika:', error);
      }
    );
  }




// Nova metoda za brisanje pratioca koristeći oba ID-a
deleteFollowerByFollowerAndFollowingIds(followerId: number, followingId: number): void {
  this.service.deleteFollowerByFollowerAndFollowingIds(followerId, followingId).subscribe(
    () => {
      console.log('Uspešno ste obrisali korisnika:', followingId);
      this.getFollowedTourists(); // Ponovo učitajte pratile
      this.getNonFollowedTourists(); // Ponovo učitajte korisnike koje ne pratite
    },
    (error: any) => {
      console.error('Greška prilikom brisanja korisnika:', error);
    }
  );
}


// Otvoriti formu za slanje poruke
openMessageForm(followerId: number): void {
  this.selectedFollowerId = followerId;
  this.showMessageForm = true;
}

// Pozivanje servisa za slanje poruke
sendMessage(): void {
  if (this.selectedFollowerId && this.messageSubject && this.messageBody) {

    //const resourceTypeValue = this.resourceType === '0' ? 'Tour' : this.resourceType === '1' ? 'Blog' : undefined;
    
    const messageRequest: SendMessageRequest = {
      senderId: this.currentUserId,
      followerId: this.selectedFollowerId,
      content: this.messageBody,
      resourceUrl: this.resourceUrl,  
      //resourceType: this.resourceType || undefined
    };

    this.service.sendMessageToFollower(messageRequest).subscribe(
      (response) => {
        console.log('Poruka i notifikacija su poslati:', response);
        this.showMessageForm = false; 
        this.messageSubject = ''; 
        this.messageBody = ''; 
        this.resourceUrl = '';
        //this.resourceType = '';
      },
      (error: any) => {
        console.error('Greška prilikom slanja poruke:', error);
      }
    );
  } else {
    console.warn('Molimo unesite naslov i telo poruke.');
  }
}


// Metoda za dobijanje notifikacija za trenutnog korisnika
getNotifications(): void {
  this.service.getNotificationsForUser(this.currentUserId).subscribe(
    (data: NotificationDto[]) => {
      this.notifications = data; // Postavi rezultate na listu notifikacija
    },
    (error: any) => {
      console.error('Greška prilikom dobijanja notifikacija:', error);
      this.notifications = []; // Ako dođe do greške, postavite praznu listu notifikacija
    }
  );
}

// Metoda za označavanje notifikacije kao pročitan
markAsRead(notificationId: number): void {
  this.service.markNotificationAsRead(notificationId).subscribe(
    response => {
      // Nakon što je notifikacija označena kao pročitana, ažuriraj stanje
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
      }
    },
    error => {
      console.error('Greška pri označavanju notifikacije kao pročitan:', error);
    }
  );
}


  
}
