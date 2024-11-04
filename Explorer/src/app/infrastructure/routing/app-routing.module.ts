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
import { AllProblemsComponent } from 'src/app/feature-modules/administration/all-problems/all-problems.component';
import { AddProblemComponent } from 'src/app/feature-modules/tour-execution/add-problem/add-problem.component';
import { TourPreferencesComponent } from 'src/app/feature-modules/marketplace/tour-preferences/tour-preferences.component';
import { BlogComponent } from 'src/app/feature-modules/blog/blog/blog.component';
import { TourComponent } from "../../feature-modules/tour-authoring/tour/tour.component";
import { UserAccountComponent } from 'src/app/feature-modules/administration/user-account/user-account.component';
import { MyEquipmentComponent } from 'src/app/feature-modules/tour-execution/my-equipment/my-equipment.component';
import { ObjectComponent } from 'src/app/feature-modules/tour-authoring/object/object.component';
import { LocationSimulatorComponent} from "../../shared/location-simulator/location-simulator.component";
import { ClubsComponent } from 'src/app/feature-modules/tour-authoring/club/club.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', component: HomeComponent },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard],},
  {path: 'comment', component: CommentComponent},
  {path: 'app-rating', component: AppRatingComponent},
  {path: 'allproblems', component: AllProblemsComponent, canActivate: [AuthGuard],},
  {path: 'addproblem', component: AddProblemComponent, canActivate: [AuthGuard],},
  {path: 'author', component: TourComponent, canActivate: [AuthGuard] },
  {path: 'my-equipment', component: MyEquipmentComponent, canActivate: [AuthGuard],},
  {path: 'author-object', component: ObjectComponent, canActivate: [AuthGuard] },
  {path: 'tour-preferences', component: TourPreferencesComponent, canActivate: [AuthGuard]},
  {path: 'blog', component: BlogComponent},
  {path: 'author', component: TourComponent, canActivate: [AuthGuard] },
  {path: 'location-simulator', component:LocationSimulatorComponent, canActivate: [AuthGuard]},
  {path: 'editUserAccount',component: UserAccountComponent},
  {path: 'allclubs', component: ClubsComponent, canActivate: [AuthGuard],},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
