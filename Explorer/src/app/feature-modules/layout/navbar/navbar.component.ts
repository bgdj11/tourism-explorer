import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TranslateService } from '@ngx-translate/core';  // Import TranslateService
import { TourExecutionService } from '../../tour-execution/tour.execution.service';
import { NotificationDto } from '../../tour-execution/model/notifications'; 

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  notifications: NotificationDto[] = [];
  isNotificationDropdownOpen: boolean = false;
  notificationsNum: number = 0;

  constructor(
    private exService: TourExecutionService,
    private authService: AuthService,
    private translateService: TranslateService  // Inject TranslateService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getNotificationsNumber();
  }

  // Change the language dynamically
  changeLanguage(lang: string): void {
    this.translateService.use(lang);
  }

  onLogout(): void {
    this.authService.logout();
    this.notifications.forEach((notification) => this.markAsRead(notification.id));
  }

  getNotificationsNumber(): void {
    this.exService.getNotificationsForUser(this.user!.id).subscribe(
      (data: NotificationDto[]) => {
        this.notifications = data;
        this.notificationsNum = this.notifications.length;
      },
      (error: any) => {
        console.error('Greška prilikom dobijanja notifikacija:', error);
        this.notifications = []; 
        this.notificationsNum = 0;
      }
    );
  }

  getNotifications(): void {
    if (!this.isNotificationDropdownOpen) {
      this.exService.getNotificationsForUser(this.user!.id).subscribe(
        (data: NotificationDto[]) => {
          this.notifications = data;
          this.notificationsNum = 0;
        },
        (error: any) => {
          console.error('Greška prilikom dobijanja notifikacija:', error);
          this.notifications = []; 
        }
      );
    }
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen; // Prebaci stanje padajuće liste
  }
  
  // Metoda za označavanje notifikacije kao pročitan
  markAsRead(notificationId: number): void {
    this.exService.markNotificationAsRead(notificationId).subscribe(
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
