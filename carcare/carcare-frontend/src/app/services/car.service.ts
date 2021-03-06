import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Globals } from '../globals';
import { Car, Currency, Deadline, DeadlineStatus, Fuel, FuelType, Insurance, Interval, Repair, Toll } from '../models/car.model';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class CarService implements OnInit {
  
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

  constructor(private _http: HttpClient, private _globals: Globals, private _datepipe: DatePipe, private indexDB: IndexedDbService) { 
    this.init();

  }

  ngOnInit(){

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

  getCar(id: string){
    return this.cars.find(car => car._id == id);
  }

  setDefault(car_id: string){

    this._http.post(environment.backendURL + 'user/change-default-car', {car_id}).subscribe(res => {
      if(res == 200){
        this.cars.forEach(car => {
          if(car._id == car_id){
            car.default = true;
          } else {
            car.default = false;
          }
        });
        localStorage.setItem('cars', JSON.stringify(this.cars));
      }
    })
  }

  addFuel(fuel: Fuel){
    var id = this.active._id;
    this._http.post(environment.backendURL + 'user/add-fuel', {car_id: id, fuel: fuel}).subscribe(res => {
      var car = this.cars.find(car => car._id == id);
      console.log(res);
      if(!car.refueling){
        car.refueling = [];
      }
      car.refueling.push(res as Fuel);
      car.refueling.sort((a, b) => {
        let d1 = new Date(a.date); let d2 = new Date(b.date);
        let same = d1.getTime() === d2.getTime();
        if (same) {
          if(a.mileage > b.mileage){
            return -1;
          } else {
            return 1;
          }
        }
        if (d1 > d2) return -1;
        if (d1 < d2) return 1;
      });
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    },err => {
      this.indexDB.addFuel(fuel, id).then(res => {
        this.backgroundSync('add-fuel', res, 'add_fuel');
      }).catch(console.log);
      
    })
  }

  deleteFuel(fuel_id: string){
    var id = this.active._id;
    var car = this.cars.find(car => car._id == id);
    car.refueling =  car.refueling.filter(fuel => fuel._id != fuel_id);
    localStorage.setItem('cars', JSON.stringify(this.cars));
    this.changeActiveCar(car);
    this._http.post(environment.backendURL + 'user/delete-fuel', {car_id: id, fuel_id: fuel_id}).subscribe(res => {
      if(res == 200){

      }
    },err => {
      this.indexDB.deleteFuel(fuel_id, id).then(res => {
        this.backgroundSync('delete-fuel', res, 'delete_fuel');
      }).catch(console.log);
      
    })
  }

  addRepair(repair: Repair){
    var id = this.active._id;
    this._http.post(environment.backendURL + 'user/add-repair', {car_id: id, repair: repair}).subscribe(res => {
      console.log(res);
      var car = this.cars.find(car => car._id = id);
      if(!car.repairs){
        car.repairs = [];
      }
      car.repairs.push(res as Repair);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    },err => {
      this.indexDB.addRepair(repair, id).then(res => {
        this.backgroundSync('add-repair', res, 'add_repair');
      }).catch(console.log);
      
    });
  }

  deleteRepair(repair_id: string){
    var id = this.active._id;
    var car = this.cars.find(car => car._id == id);
    car.repairs =  car.repairs.filter(repair => repair._id != repair_id);
    localStorage.setItem('cars', JSON.stringify(this.cars));
    this.changeActiveCar(car);
    this._http.post(environment.backendURL + 'user/delete-repair', {car_id: id, repair_id: repair_id}).subscribe(res => {
      if(res == 200){

      }
    },err => {
      this.indexDB.deleteRepair(repair_id, id).then(res => {
        this.backgroundSync('delete-repair', res, 'delete_repair');
      }).catch(console.log);
      
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
    toll.expiration = expiration;
    this._http.post(environment.backendURL + 'user/add-toll', {car_id: id, toll: toll}).subscribe(res => {
      var car = this.cars.find(car => car._id == id);
      if(!car.tolls){
        car.tolls = [];
      }
      car.tolls.push(res as Toll);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    },err => {
      this.indexDB.addToll(toll, id).then(res => {
        this.backgroundSync('add-toll', res, 'add_toll');
      }).catch(console.log);
      
    }); 

    const deadline = {
      _id: null,
      deadline: expiration,
      title: 'Toll',
      description: toll.country + ' - ' + toll.region + ' toll expiration',
      price: null,
      currency: null,
      status: DeadlineStatus.pending,
      repeating: false
    }
    this.addDeadline(deadline, id);
  }

  deleteToll(toll_id: string){
    var id = this.active._id;
    var car = this.cars.find(car => car._id == id);
    car.tolls =  car.tolls.filter(toll => toll._id != toll_id);
    localStorage.setItem('cars', JSON.stringify(this.cars));
    this.changeActiveCar(car);
    this._http.post(environment.backendURL + 'user/delete-toll', {car_id: id, toll_id: toll_id}).subscribe(res => {
      if(res == 200){

      }
    },err => {
      this.indexDB.deleteToll(toll_id, id).then(res => {
        this.backgroundSync('delete-toll', res, 'delete_toll');
      }).catch(console.log);
      
    })
  }

  addInsurance(insurance: Insurance){
    var id = this.active._id;
    this._http.post(environment.backendURL + 'user/add-insurance', {car_id: id, insurance: insurance}).subscribe(res => {
      var car = this.cars.find(car => car._id == id);
      if(!car.insurances){
        car.insurances = [];
      }
      car.insurances.push(res as Insurance);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.changeActiveCar(car);
    },err => {
      this.indexDB.addInsurance(insurance, id).then(res => {
        this.backgroundSync('add-insurance', res, 'add_insurance');
      }).catch(console.log);
      
    }); 

    let months = null; 
    let years = null;
    if(insurance.interval == Interval.quarterly){
      months = 3;
    } else if(insurance.interval == Interval.yearly){
      years = 1;
    }

    const deadline = {
      _id: null,
      deadline: insurance.first_deadline,
      title: "Insurance",
      description: insurance.service_provider + " Insurance",
      price: insurance.fee,
      currency: insurance.currency,
      status: DeadlineStatus.pending,
      repeating: true,
      days: null,
      months: months,
      years: years
    }
    this.addDeadline(deadline, id);
  }

  deleteInsurance(insurance_id: string){
    var id = this.active._id;
    var car = this.cars.find(car => car._id == id);
    car.insurances =  car.insurances.filter(insurance => insurance._id != insurance_id);
    localStorage.setItem('cars', JSON.stringify(this.cars));
    this.changeActiveCar(car);
    this._http.post(environment.backendURL + 'user/delete-insurance', {car_id: id, insurance_id: insurance_id}).subscribe(res => {
      if(res == 200){

      }
    },err => {
      this.indexDB.deleteInsurance(insurance_id, id).then(res => {
        this.backgroundSync('delete-insurance', res, 'delete_insurance');
      }).catch(console.log);
      
    })
  }

  addDeadline(deadline: Deadline, car_id?: string){
    var id;
    if(car_id){
      id = car_id;
      console.log(id);
    } else {
      id = this.active._id;
    }
    deadline.deadline = new Date(deadline.deadline);
    this._http.post(environment.backendURL + 'user/add-deadline', {car_id: id, deadline: deadline}).subscribe(res => {
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
    },err => {
      this.indexDB.addDeadline(deadline, id).then(res => {
        this.backgroundSync('add-deadline', res, 'add_deadline');
      }).catch(console.log);
      
    }); 
  }

  deleteDeadline(deadline_id: string){
    var id = this.active._id;
    var car = this.cars.find(car => car._id == id);
    car.calendar =  car.calendar.filter(calendar => calendar._id != deadline_id);
    localStorage.setItem('cars', JSON.stringify(this.cars));
    this.changeActiveCar(car);
    this._http.post(environment.backendURL + 'user/delete-deadline', {car_id: id, deadline_id: deadline_id}).subscribe(res => {
      if(res == 200){

      }
    },err => {
      this.indexDB.deleteDeadline(deadline_id, id).then(res => {
        this.backgroundSync('delete-deadline', res, 'delete_deadline');
      }).catch(console.log);
      
    })
  }

  markDeadline(deadline_id: string, status: DeadlineStatus){
    var id = this.active._id;
    this._http.post(environment.backendURL + 'user/mark-deadline', {car_id: id, deadline_id: deadline_id, status: status}).subscribe(res => {
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
    this._http.post(environment.backendURL + 'user/add-car', newcar).subscribe(res => {
      console.log('done');
      console.log(res);
      var car = res as Car;
      this.cars.push(car);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      if(this.cars.length == 1){
        this.changeActiveCar(this.cars[0]);
      }
    },err => {
      this.indexDB.addCar(newcar).then(res => {
        this.backgroundSync('add-car', res, 'add_car');
      }).catch(console.log);
      
    })
  }

  async updateCar(car_id: string, carUpdate: Car){
    const result = await this._http.post(environment.backendURL + 'user/update-car', {car_id, car: carUpdate}).toPromise();
    if(result == 200){
      const car = this.cars.find(car => car._id == car_id);
      if(car){
        car.license_plate = carUpdate.license_plate;
        car.brand = carUpdate.brand;
        car.car_model = carUpdate.car_model;
        car.fuel_type = carUpdate.fuel_type;
        car.vin = carUpdate.vin;
        car.release_year = carUpdate.release_year;
        localStorage.setItem('cars', JSON.stringify(this.cars));
        return true;
      }
    }
    return false;
  }

  UploadPicture(car: Car, picture: string){
    let now = new Date();
    const date = this._datepipe.transform(now, 'yyyy.MM.dd h:mm');
    const pictureObject = {
      upload_date: date,
      picture: picture
    }
    const carGalleryId = car.pictures ? car.pictures : null;
    this._http.post(environment.backendURL + 'pictures/add-car-picture', {car_gallery_id: carGalleryId, car_id: car._id, picture: pictureObject}).subscribe(res => {
      if(res == 200 && carGalleryId != null && sessionStorage.getItem(carGalleryId)){
        const gallery = JSON.parse(sessionStorage.getItem(carGalleryId));
        gallery.pictures.push(pictureObject);
        sessionStorage.setItem(carGalleryId, gallery);
      } else {
        car.pictures = res as string;
      }
    });
  }

  getCarPictures(gallery_id: string){

    return this._http.get(environment.backendURL + 'pictures/car-pictures/' + gallery_id);
  }

  getFuelBill(picture_id: string){
    return this._http.get(environment.backendURL + 'pictures/car-pictures/fuel/' + this.active.pictures + '/' + picture_id);
  }

  getRepairBill(picture_id: string){
    return this._http.get(environment.backendURL + 'pictures/car-pictures/repair/' + this.active.pictures + '/' + picture_id);
  }
  
  backgroundSync(callPath: string, key: string, objectStore: string){
    navigator.serviceWorker.ready.then((swRegistration) => {
      swRegistration.sync.register(JSON.stringify({path: callPath, key: key, objectStore: objectStore,}))
    }).catch(console.log);

    
    
  }

}
