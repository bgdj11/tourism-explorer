import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TranslateService } from '@ngx-translate/core';  // Import TranslateService

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;

  constructor(
    private authService: AuthService,
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
}
