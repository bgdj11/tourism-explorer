import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { AppRatingComponent } from 'src/app/feature-modules/layout/app-rating/app-rating.component';
import { AllProblemsComponent } from 'src/app/feature-modules/administration/all-problems/all-problems.component';
import { AddProblemComponent } from 'src/app/feature-modules/tour-execution/add-problem/add-problem.component';
import { TourComponent } from "../../feature-modules/tour-authoring/tour/tour.component";
import { ObjectComponent } from 'src/app/feature-modules/tour-authoring/object/object.component';
const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', component: HomeComponent },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'app-rating', component: AppRatingComponent},
  {path: 'allproblems', component: AllProblemsComponent, canActivate: [AuthGuard],},
  {path: 'addproblem', component: AddProblemComponent, canActivate: [AuthGuard],},
  {path: 'author', component: TourComponent, canActivate: [AuthGuard] },
  {path: 'author-object', component: ObjectComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
