import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TranslateService } from '@ngx-translate/core';  
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TourExecutionService } from '../../tour-execution/tour.execution.service';
import { NotificationDto } from '../../tour-execution/model/notifications'; 

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  isSidenavOpened = false;
  notifications: NotificationDto[] = [];
  isNotificationDropdownOpen: boolean = false;
  notificationsNum: number = 0;

  constructor(
    private exService: TourExecutionService,
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService  // Inject TranslateService
  ) {
     this.translateService.addLangs(['en', 'sr']);
     this.translateService.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.checkIfUserExists();

    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang?.match(/en|sr/) ? browserLang : 'en');
  }

  private checkIfUserExists(): void {
    this.authService.checkIfUserExists();
    this.getNotificationsNumber();
  }

  changeLanguage(lang: string): void {
    this.translateService.use(lang);
  }

  onLogout(): void {
    this.authService.logout();
    this.notifications.forEach((notification) => this.markAsRead(notification.id));
  }

  toggleSidenav(): void {
    console.log("USAO U METODU!")
    this.isSidenavOpened = !this.isSidenavOpened;

    const sidenavElement = document.querySelector('.meninav');
    if (sidenavElement) {
      if (this.isSidenavOpened) {
        sidenavElement.classList.add('opened');
      } else {
        sidenavElement.classList.remove('opened');
      }
    }
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
