import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuelType } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {
  fuelTypeEnum = FuelType;
  keys = Object.keys;
  addCar: FormGroup;
  carId: string = null;
  msg: string = '';
  btnMsg: string = 'Add Car';
  constructor(private fb: FormBuilder, private router: Router, private carsService: CarService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('id');

    this.addCar = this.fb.group(
      {
        license_plate: ['', [
          Validators.required
        ]],
        brand: ['', [
          Validators.required
        ]],
        car_model: ['',[
          Validators.required
        ]],
        fuel_type: [FuelType.gasoline, [
          Validators.required
        ]],
        vin: ['',[
          Validators.required,
          Validators.maxLength(17),
          Validators.minLength(17)
        ]],
        release_year: ['', [
          Validators.required,
          Validators.maxLength(4),
          Validators.minLength(4),
          Validators.min(1900),
          Validators.max(2020)
        ]]
    });

    if(this.carId){
      this.btnMsg = 'Update';
      const car = this.carsService.getCar(this.carId);
      this.license_plate.setValue(car.license_plate);
      this.brand.setValue(car.brand);
      this.car_model.setValue(car.car_model);
      this.fuel_type.setValue(car.fuel_type == FuelType.gasoline ? FuelType.gasoline : FuelType.diesel);
      this.vin.setValue(car.vin);
      this.release_year.setValue(car.release_year);
    }
  }

  submit(){
    const car = this.addCar.value;
    if(this.carId){
      this.carsService.updateCar(this.carId, car).then(res => {
        if(res){
          this.navigateTo('garage');
        } else {
          this.msg = "COULDN'T UPDATE";
        }
      })
    } else {
      this.carsService.addCar(car);
      this.navigateTo('garage');
    }
  }

  navigateTo(url: string){
    this.router.navigate(['user/' + url])
  }

  changeFuelType(e){
    var str = e.target.value.split(" ");
    this.fuel_type.setValue(str[1]);   
  }

  get fuel_type(){
    return this.addCar.get('fuel_type');
  }

  get license_plate(){
    return this.addCar.get('license_plate');
  }

  get brand(){
    return this.addCar.get('brand');
  }

  get car_model(){
    return this.addCar.get('car_model');
  }

  get vin(){
    return this.addCar.get('vin');
  }

  get release_year(){
    return this.addCar.get('release_year');
  }

}
