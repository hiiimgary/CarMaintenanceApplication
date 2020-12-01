import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCarComponent } from './components/garage/add-car/add-car.component';
import { AddFuelComponent } from './components/service/refills/add-fuel/add-fuel.component';
import { AddTollComponent } from './components/service/tolls/add-toll/add-toll.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthRegisterComponent } from './components/auth-register/auth-register.component';
import { BaseComponent } from './components/base/base.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GarageComponent } from './components/garage/garage.component';
import { HomeComponent } from './components/home/home.component';
import { AddInsuranceComponent } from './components/service/insurances/add-insurance/add-insurance.component';
import { InsurancesComponent } from './components/service/insurances/insurances.component';
import { RefillsComponent } from './components/service/refills/refills.component';
import { ServiceComponent } from './components/service/service.component';
import { TollsComponent } from './components/service/tolls/tolls.component';
import { AuthGuard } from './services/auth.guard';
import { RepairsComponent } from './components/service/repairs/repairs.component';
import { AddRepairComponent } from './components/service/repairs/add-repair/add-repair.component';
import { AddDeadlineComponent } from './components/calendar/add-deadline/add-deadline.component';
import { CommunityComponent } from './components/home/community/community.component';


const routes: Routes = [
  {path: '', component: AuthLoginComponent},
  {path: 'registration', component: AuthRegisterComponent},
  {path: 'user', component: BaseComponent, canActivate: [AuthGuard],
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'home/community', component: CommunityComponent},
      {path: 'garage', component: GarageComponent},
      {path: 'garage/add-car', component: AddCarComponent},
      {path: 'service', component: ServiceComponent},
      {path: 'service/fuel', component: RefillsComponent},
      {path: 'service/fuel/add-fuel', component: AddFuelComponent},
      {path: 'service/repairs', component: RepairsComponent},
      {path: 'service/repairs/add-repair', component: AddRepairComponent},
      {path: 'service/tolls', component: TollsComponent},
      {path: 'service/tolls/add-toll', component: AddTollComponent},
      {path: 'service/insurances', component: InsurancesComponent},
      {path: 'service/insurances/add-insurance', component: AddInsuranceComponent},
      {path: 'calendar', component: CalendarComponent},
      {path: 'calendar/add-deadline', component: AddDeadlineComponent},
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
