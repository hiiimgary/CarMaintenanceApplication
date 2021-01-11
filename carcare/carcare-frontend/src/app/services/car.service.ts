import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Globals } from '../globals';
import { Car, Currency, Deadline, DeadlineStatus, Fuel, FuelType, Insurance, Repair, Toll } from '../models/car.model';
import { DatePipe } from '@angular/common';

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

  constructor(private _http: HttpClient, private _globals: Globals, private _datepipe: DatePipe) { 
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

  logout(){
    this.cars = [];
  }

  changeActiveCar(car: Car){
    this.active = car;
    this.carSource.next(car);
  }

  addFuel(fuel: Fuel){
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/add-fuel', {car_id: id, fuel: fuel}).subscribe(res => {
      var car = this.cars.find(car => car._id == id);
      if(!car.refueling){
        car.refueling = [];
      }
      car.refueling.push(res as Fuel);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    })
  }

  deleteFuel(fuel_id: string){
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/delete-fuel', {car_id: id, fuel_id: fuel_id}).subscribe(res => {
      if(res == 200){
        var car = this.cars.find(car => car._id == id);
        car.refueling =  car.refueling.filter(fuel => fuel._id != fuel_id);
        localStorage.setItem('cars', JSON.stringify(this.cars));
        this.changeActiveCar(car);
      }
    })
  }

  addRepair(repair: Repair){
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/add-repair', {car_id: id, repair: repair}).subscribe(res => {
      console.log(res);
      var car = this.cars.find(car => car._id = id);
      if(!car.repairs){
        car.repairs = [];
      }
      car.repairs.push(res as Repair);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    });
  }

  deleteRepair(repair_id: string){
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/delete-repair', {car_id: id, repair_id: repair_id}).subscribe(res => {
      if(res == 200){
        var car = this.cars.find(car => car._id == id);
        car.repairs =  car.repairs.filter(repair => repair._id != repair_id);
        localStorage.setItem('cars', JSON.stringify(this.cars));
        this.changeActiveCar(car);
      }
    })
  }

  addToll(toll: Toll){
    var id = this.active._id;
    let expiration = new Date(toll.purchase_date);
    switch(toll.duration){
      case "Weekly": { expiration.setDate(expiration.getDate() + 10); break;}
      case "Monthly": {expiration.setMonth(expiration.getMonth() +1 ); break;}
      case "Yearly": {
        expiration.setFullYear(expiration.getFullYear() + 1);
        expiration.setMonth(1);
        expiration.setDate(0);
        break;
      }
      default: { console.log('wrong format'); break; }
    }
    toll.expiration = this._datepipe.transform(expiration, 'yyyy.MM.dd');
    this._http.post(this._globals.BASE_URL + 'user/add-toll', {car_id: id, toll: toll}).subscribe(res => {
      var car = this.cars.find(car => car._id == id);
      if(!car.tolls){
        car.tolls = [];
      }
      car.tolls.push(res as Toll);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    }); 
    //TODO: add calendar entry  
  }

  deleteToll(toll_id: string){
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/delete-toll', {car_id: id, toll_id: toll_id}).subscribe(res => {
      if(res == 200){
        var car = this.cars.find(car => car._id == id);
        car.tolls =  car.tolls.filter(toll => toll._id != toll_id);
        localStorage.setItem('cars', JSON.stringify(this.cars));
        this.changeActiveCar(car);
      }
    })
  }

  addInsurance(insurance: Insurance){
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/add-insurance', {car_id: id, insurance: insurance}).subscribe(res => {
      var car = this.cars.find(car => car._id == id);
      if(!car.insurances){
        car.insurances = [];
      }
      car.insurances.push(res as Insurance);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    }); 

    //TODO: ADD to Calendar
  }

  deleteInsurance(insurance_id: string){
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/delete-insurance', {car_id: id, insurance_id: insurance_id}).subscribe(res => {
      if(res == 200){
        var car = this.cars.find(car => car._id == id);
        car.insurances =  car.insurances.filter(insurance => insurance._id != insurance_id);
        localStorage.setItem('cars', JSON.stringify(this.cars));
        this.changeActiveCar(car);
      }
    })
  }

  addDeadline(deadline: Deadline, car_id?: string){
    var id;
    if(car_id){
      id = car_id;
    } else {
      id = this.active._id;
    }
    deadline.deadline = new Date(deadline.deadline);
    this._http.post(this._globals.BASE_URL + 'user/add-deadline', {car_id: id, deadline: deadline}).subscribe(res => {
      console.log(res);
      var car = this.cars.find(car => car._id == id);
      if(!car.calendar){
        car.calendar = [];
      }
      car.calendar.push(res as Deadline);
      car.calendar.sort((a, b) => {
        let d1 = new Date(a.deadline); let d2 = new Date(b.deadline);
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;
        if (d1 > d2) return 1;
        if (d1 < d2) return -1;
      });
      if(deadline.repeating && deadline.status == DeadlineStatus.done){
        this.createNextRepeatingDeadline(deadline, id);
      }
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    }); 
  }

  deleteDeadline(deadline_id: string){
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/delete-deadline', {car_id: id, deadline_id: deadline_id}).subscribe(res => {
      if(res == 200){
        var car = this.cars.find(car => car._id == id);
        car.calendar =  car.calendar.filter(calendar => calendar._id != deadline_id);
        localStorage.setItem('cars', JSON.stringify(this.cars));
        this.changeActiveCar(car);
      }
    })
  }

  markDeadline(deadline_id: string, status: DeadlineStatus){
    var id = this.active._id;
    this._http.post(this._globals.BASE_URL + 'user/mark-deadline', {car_id: id, deadline_id: deadline_id, status: status}).subscribe(res => {
      if(res == 200){
        var car = this.cars.find(car => car._id == id);
        let deadline =  car.calendar.find(calendar => calendar._id == deadline_id);
        deadline.status = status;
        if(deadline.repeating && status != DeadlineStatus.past_due){
          this.createNextRepeatingDeadline(deadline, id);
        }
        localStorage.setItem('cars', JSON.stringify(this.cars));
        this.changeActiveCar(car);
      }
    })
  }


  createNextRepeatingDeadline(deadline: Deadline, car_id: string){
    let date = new Date(deadline.deadline);
    date.setDate(date.getDate() + deadline.days);
    date.setMonth(date.getMonth() + deadline.months);
    date.setFullYear(date.getFullYear() + deadline.years);

    const newDeadline =  {
      deadline: date,
      title: deadline.title,
      description: deadline.description, 
      price: deadline.price,
      currency: deadline.currency,
      status: DeadlineStatus.pending,
      repeating: true,
      days: deadline.days,
      months: deadline.months,
      years: deadline.years,
    }
    this.addDeadline(newDeadline as Deadline, car_id);
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

  UploadPicture(car: Car, picture: string){
    let now = new Date();
    const date = this._datepipe.transform(now, 'yyyy.MM.dd h:mm');
    const pictureObject = {
      upload_date: date,
      picture: picture
    }
    const carGalleryId = car.pictures ? car.pictures : null;
    console.log({car_gallery_id: carGalleryId, car_id: car._id, pictureObject});
    this._http.post(this._globals.BASE_URL + 'pictures/add-car-picture', {car_gallery_id: carGalleryId, car_id: car._id, picture: pictureObject}).subscribe(res => {
      if(res == 200 && carGalleryId != null && sessionStorage.getItem(carGalleryId)){
        const gallery = JSON.parse(sessionStorage.getItem(carGalleryId));
        gallery.pictures.push(pictureObject);
        sessionStorage.setItem(carGalleryId, gallery);
      }
    });
  }

  getCarPictures(gallery_id: string){

    return this._http.get(this._globals.BASE_URL + 'pictures/car-pictures/' + gallery_id);
  }

}
