import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Car, Currency, Fuel, FuelType } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  
  carsStorage: Car[] = [
    {
      id: "1",
      default: true,
      license_plate: "MSR-655",
      brand: "Volkswagen",
      car_model: "Golf 4 Variant",
      vin: "wwwvw123sdfdf1js",
      release_year: "2001",
      refueling: [
        {
          id: "1",
          date: "2020-10-18",
          station: "SHE",
          type: FuelType.diesel,
          amount: 38,
          price: 15000,
          currency: Currency.HUF,
          mileage: 244586
        },
        {
          id: "2",
          date: "2020-10-20",
          station: "SHE",
          type: FuelType.diesel,
          amount: 30,
          price: 13000,
          currency: Currency.HUF,
          mileage: 244586
        }
      ]
    },
    {
      id: "1",
      default: false,
      license_plate: "MSR-654",
      brand: "Volkswagen",
      car_model: "Golf 7 Variant",
      vin: "wwwvw123sdfdf1js",
      release_year: "2013",
      refueling: [
        {
          id: "1",
          date: "2020-10-18",
          station: "MOL",
          type: FuelType.diesel,
          amount: 38,
          price: 15000,
          currency: Currency.HUF,
          mileage: 244586
        },
        {
          id: "2",
          date: "2020-10-20",
          station: "MOL",
          type: FuelType.diesel,
          amount: 30,
          price: 13000,
          currency: Currency.HUF,
          mileage: 244586
        }
      ]
    }]

  private carSource = new BehaviorSubject<Car>(null);
  activeCar = this.carSource.asObservable();
  active: Car;
  cars: Car[];

  constructor() { 
    this.init();
  }

  async init(){
    this.cars = [];
    if(localStorage.getItem('cars') != null){
      this.cars = JSON.parse(localStorage.getItem('cars'));
    } else {
      this.cars = await this.carsStorage;
      localStorage.setItem('cars', JSON.stringify(this.cars));
    }
    this.cars.forEach(car => {
      if(car.default){
        this.active = car;
        this.carSource.next(car);
      } 
    })
  }

  async getCars(){
    return await this.cars;
  }

  changeActiveCar(car: Car){
    this.active = car;
    this.carSource.next(car);
  }

  addFuel(fuel: Fuel){
    //TODO : Add ID, push to DB
    if(this.active.refueling == undefined){
      this.active.refueling = [];
    }
    this.active.refueling.push(fuel);
    this.changeActiveCar(this.active);
  }

  addCar(car: Car){
    //TODO : Add ID, push to DB
    if(this.cars == null){
      car.default = true;
      this.cars.push(car);
      this.changeActiveCar(car);
    }
    this.cars.push(car);
    
  }

}
