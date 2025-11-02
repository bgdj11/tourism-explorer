import { Component, OnInit } from '@angular/core';
import { AuthService } from './infrastructure/auth/auth.service';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService
import 'leaflet-routing-machine';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Explorer';

  constructor(
    private authService: AuthService,
    private translateService: TranslateService // Inject TranslateService
  ) {
    // Add available languages
    this.translateService.addLangs(['en', 'sr']);
    // Set the default language
    this.translateService.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.checkIfUserExists();

    // Set initial language based on browser preference
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang?.match(/en|sr/) ? browserLang : 'en');
  }

  private checkIfUserExists(): void {
    this.authService.checkIfUserExists();
  }

  changeLanguage(lang: string): void {
    this.translateService.use(lang);
  }
}
