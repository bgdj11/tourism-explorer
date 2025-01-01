import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TranslateService } from '@ngx-translate/core';  // Import TranslateService
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';


@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  isSidenavOpened = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService  // Inject TranslateService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  // Change the language dynamically
  changeLanguage(lang: string): void {
    this.translateService.use(lang);
  }

  onLogout(): void {
    this.authService.logout();
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

}
