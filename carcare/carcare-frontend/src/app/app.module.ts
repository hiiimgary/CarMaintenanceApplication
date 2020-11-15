import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthRegisterComponent } from './components/auth-register/auth-register.component';
import { BaseComponent } from './components/base/base.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Globals } from './globals';
import { GarageComponent } from './components/garage/garage.component';
import { ServiceComponent } from './components/service/service.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CarComponent } from './components/garage/car/car.component';
import { RefillsComponent } from './components/service/refills/refills.component';
import { FuelComponent } from './components/service/refills/fuel/fuel.component';
import { AddFuelComponent } from './components/service/refills/add-fuel/add-fuel.component';
import { AddCarComponent } from './components/garage/add-car/add-car.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AuthGuard } from './services/auth.guard';
import { TollsComponent } from './components/service/tolls/tolls.component';
import { AddTollComponent } from './components/service/tolls/add-toll/add-toll.component';
import { TollComponent } from './components/service/tolls/toll/toll.component';
import { InsurancesComponent } from './components/service/insurances/insurances.component';
import { InsuranceComponent } from './components/service/insurances/insurance/insurance.component';
import { AddInsuranceComponent } from './components/service/insurances/add-insurance/add-insurance.component';
import { RepairsComponent } from './components/service/repairs/repairs.component';
import { RepairComponent } from './components/service/repairs/repair/repair.component';
import { AddRepairComponent } from './components/service/repairs/add-repair/add-repair.component';
import {NgxImageCompressService} from 'ngx-image-compress';


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
    AddCarComponent,
    TollsComponent,
    AddTollComponent,
    TollComponent,
    InsurancesComponent,
    InsuranceComponent,
    AddInsuranceComponent,
    RepairsComponent,
    RepairComponent,
    AddRepairComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    Globals, 
    AuthGuard, 
    DatePipe, 
    NgxImageCompressService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
