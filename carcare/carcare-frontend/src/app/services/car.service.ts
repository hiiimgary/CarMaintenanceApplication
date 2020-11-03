import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Globals } from '../globals';
import { Car, Currency, Fuel, FuelType } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  
  defaultCar: Car = {
    _id: '1',
    default: false,
    license_plate: '-',
    brand: '',
    car_model: '',
    vin: '',
    fuel_type: '',
    release_year: '',
  }

  private carSource = new BehaviorSubject<Car>(null);
  activeCar = this.carSource.asObservable();
  active: Car;
  cars: Car[];

  constructor(private _http: HttpClient, private _globals: Globals) { 
    this.init();
  }

  async init(){
    this.cars = [];
    if(localStorage.getItem('cars') != null){
      this.cars = JSON.parse(localStorage.getItem('cars'));
    } 
    if(this.cars.length != 0){
      this.cars.forEach(car => {
        if(car.default){
          this.active = car;
          this.carSource.next(car);
        } 
      });
    } else {
      this.active = this.defaultCar;
      this.carSource.next(this.defaultCar);
    }

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
    // if(this.active.refueling == undefined){
    //   this.active.refueling = [];
    // }
    // this.active.refueling.push(fuel);
    // this.changeActiveCar(this.active);
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/add-fuel', {car_id: id, fuel: fuel}).subscribe(res => {
      console.log(res);
      var car = this.cars.find(car => car._id == id);
      if(!car.refueling){
        car.refueling = [];
      }
      car.refueling.push(res as Fuel);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    })
  }

  async addCar(newcar: Car){
    if(this.cars.length == 0){
      newcar.default = true;
    } else {
      newcar.default = false;
    }
    this._http.post(this._globals.BASE_URL + 'user/add-car', newcar).subscribe(res => {
      console.log('done');
      console.log(res);
      var car = res as Car;
      this.cars.push(car);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      if(this.cars.length == 1){
        this.changeActiveCar(this.cars[0]);
      }
    })
  }

}
