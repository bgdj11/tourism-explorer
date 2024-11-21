import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './infrastructure/routing/app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './feature-modules/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './infrastructure/material/material.module';
import { AdministrationModule } from './feature-modules/administration/administration.module';
import { BlogModule } from './feature-modules/blog/blog.module';
import { MarketplaceModule } from './feature-modules/marketplace/marketplace.module';
import { TourAuthoringModule } from './feature-modules/tour-authoring/tour-authoring.module';
import { TourExecutionModule } from './feature-modules/tour-execution/tour-execution.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './infrastructure/auth/jwt/jwt.interceptor';
import { TourComponent } from './feature-modules/tour-authoring/tour/tour.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    AdministrationModule,
    MarketplaceModule,
    TourAuthoringModule,
    TourExecutionModule,
    AuthModule,
    HttpClientModule,
    FontAwesomeModule,
    HttpClientModule,
    BlogModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
