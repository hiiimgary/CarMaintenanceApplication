import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {

  addCar: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private carsService: CarService) { }

  ngOnInit(): void {
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
  }

  submit(){
    const car = this.addCar.value;
    this.carsService.addCar(car);
    this.navigateTo('garage');
  }

  navigateTo(url: string){
    this.router.navigate(['user/' + url])
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
