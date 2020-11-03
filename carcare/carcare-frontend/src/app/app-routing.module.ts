import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCarComponent } from './components/add-car/add-car.component';
import { AddFuelComponent } from './components/add-fuel/add-fuel.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthRegisterComponent } from './components/auth-register/auth-register.component';
import { BaseComponent } from './components/base/base.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GarageComponent } from './components/garage/garage.component';
import { HomeComponent } from './components/home/home.component';
import { RefillsComponent } from './components/refills/refills.component';
import { ServiceComponent } from './components/service/service.component';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  {path: '', component: AuthLoginComponent},
  {path: 'registration', component: AuthRegisterComponent},
  {path: 'user', component: BaseComponent, canActivate: [AuthGuard],
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'garage', component: GarageComponent},
      {path: 'garage/add-car', component: AddCarComponent},
      {path: 'service', component: ServiceComponent},
      {path: 'service/fuel', component: RefillsComponent},
      {path: 'service/fuel/add-fuel', component: AddFuelComponent},
      {path: 'calendar', component: CalendarComponent},
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
