import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthRegisterComponent } from './components/auth-register/auth-register.component';
import { BaseComponent } from './components/base/base.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { Globals } from './globals';
import { GarageComponent } from './components/garage/garage.component';
import { ServiceComponent } from './components/service/service.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CarComponent } from './components/car/car.component';
import { RefillsComponent } from './components/refills/refills.component';
import { FuelComponent } from './components/fuel/fuel.component';
import { AddFuelComponent } from './components/add-fuel/add-fuel.component';
import { AddCarComponent } from './components/add-car/add-car.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthLoginComponent,
    AuthRegisterComponent,
    BaseComponent,
    HomeComponent,
    GarageComponent,
    ServiceComponent,
    CalendarComponent,
    CarComponent,
    RefillsComponent,
    FuelComponent,
    AddFuelComponent,
    AddCarComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
