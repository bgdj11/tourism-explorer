import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { AccountsComponent } from 'src/app/feature-modules/administration/accounts/accounts.component';
import { CommentComponent } from 'src/app/feature-modules/blog/comment/comment.component';
import { AppRatingComponent } from 'src/app/feature-modules/layout/app-rating/app-rating.component';
import { TourPreferencesComponent } from 'src/app/feature-modules/marketplace/tour-preferences/tour-preferences.component';
import { BlogComponent } from 'src/app/feature-modules/blog/blog/blog.component';
import { TourComponent } from "../../feature-modules/tour-authoring/tour/tour.component";
import { UserAccountComponent } from 'src/app/feature-modules/administration/user-account/user-account.component';
import { MyEquipmentComponent } from 'src/app/feature-modules/tour-execution/my-equipment/my-equipment.component';
import { ObjectComponent } from 'src/app/feature-modules/tour-authoring/object/object.component';
import { LocationSimulatorComponent} from "../../shared/location-simulator/location-simulator.component";
import { ClubsComponent } from 'src/app/feature-modules/tour-authoring/club/club.component';
import { TourSearchComponent } from 'src/app/feature-modules/layout/tour-search/tour-search.component';
import { StartTourComponent } from 'src/app/feature-modules/tour-execution/start-tour/start-tour.component';
import { MyToursComponent } from 'src/app/feature-modules/tour-execution/my-tours/my-tours.component';
import { FollowersComponent } from 'src/app/feature-modules/tour-execution/followers/followers.component';
import {EncounterComponent} from "../../feature-modules/administration/encounter/encounter.component";
import { MarketComponent } from 'src/app/feature-modules/marketplace/market/market.component';
import { TourProblemsComponent } from 'src/app/feature-modules/administration/tour-problems/tour-problems.component';
import { ShoppingCartComponent } from 'src/app/feature-modules/marketplace/shopping-cart/shopping-cart.component';
import { TourSaleComponent } from 'src/app/feature-modules/marketplace/tour-sale/tour-sale.component';
import { HomePageComponent } from 'src/app/feature-modules/layout/home-page/home-page.component';
import { ToursListComponent } from 'src/app/feature-modules/layout/tours-list/tours-list.component';
import {TouristProfileComponent} from "../../shared/tourist-profile/tourist-profile.component";
import { CouponComponent } from 'src/app/feature-modules/marketplace/coupon/coupon.component';
import {SpaceInvadersComponent} from "../../feature-modules/space-invaders/space-invaders.component";
import { BundleComponent } from 'src/app/feature-modules/tour-authoring/bundle/bundle.component';
import { PacagesPublComponent } from 'src/app/feature-modules/marketplace/pacages-publ/pacages-publ.component';
import { MyPacagesComponent } from 'src/app/feature-modules/marketplace/my-pacages/my-pacages.component';
import {TetrisComponent} from "../../feature-modules/tetris/tetris.component";
import {MemoryGameComponent} from "../../feature-modules/memory-game/memory-game.component";



const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', component: HomeComponent },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard],},
  {path: 'comment', component: CommentComponent},
  {path: 'app-rating', component: AppRatingComponent},
  {path: 'encounter', component: EncounterComponent},
  //{path: 'allproblems', component: AllProblemsComponent, canActivate: [AuthGuard],},
  //{path: 'addproblem', component: AddProblemComponent, canActivate: [AuthGuard],},
  {path: 'author', component: TourComponent, canActivate: [AuthGuard] },
  {path: 'my-equipment', component: MyEquipmentComponent, canActivate: [AuthGuard],},
  {path: 'author-object', component: ObjectComponent, canActivate: [AuthGuard] },
  {path: 'tour-preferences', component: TourPreferencesComponent, canActivate: [AuthGuard]},
  {path: 'blog', component: BlogComponent},
  {path: 'author', component: TourComponent, canActivate: [AuthGuard] },
  {path: 'location-simulator', component:LocationSimulatorComponent, canActivate: [AuthGuard]},
  {path: 'editUserAccount',component: UserAccountComponent},
  {path: 'allclubs', component: ClubsComponent, canActivate: [AuthGuard],},
  {path: 'tour-search', component: TourSearchComponent},
  {path: 'start-tour', component: StartTourComponent, canActivate: [AuthGuard], },
  {path: 'mytours', component: MyToursComponent, canActivate: [AuthGuard],},
  {path: 'followers', component: FollowersComponent, canActivate: [AuthGuard],},
  {path: 'market', component: MarketComponent, canActivate: [AuthGuard],},
  {path: 'tour-problems', component: TourProblemsComponent, canActivate: [AuthGuard],},
  {path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard],},
  {path: 'sales', component: TourSaleComponent, canActivate: [AuthGuard],},
  {path: 'home-page', component: HomePageComponent},
  {path: 'tour-list', component: ToursListComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard],},
  {path: 'tourist-profile', component: TouristProfileComponent, canActivate: [AuthGuard],},
  {path: 'coupon', component: CouponComponent, canActivate: [AuthGuard],},
  { path: 'space-invaders', component: SpaceInvadersComponent },
  {path: 'tetris', component: TetrisComponent},
  {path: 'memory-game', component: MemoryGameComponent},
  { path: 'bundle', component: BundleComponent },
  {path: 'paceges-publ', component: PacagesPublComponent, canActivate: [AuthGuard],},
  {path: 'my-pacages', component: MyPacagesComponent, canActivate: [AuthGuard],}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
