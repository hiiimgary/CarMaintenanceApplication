import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Car, Currency, Fuel, FuelType } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-add-fuel',
  templateUrl: './add-fuel.component.html',
  styleUrls: ['./add-fuel.component.scss']
})
export class AddFuelComponent implements OnInit {
  car: Car;
  addFuel: FormGroup;
  fueltypeOptions = ['gasoline', 'diesel'];
  currencyOptions = ['HUF', 'EUR', 'USD'];

  constructor(private fb: FormBuilder, private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => this.car = car);

    this.addFuel = this.fb.group({
      date: ['', [
        Validators.required        
      ]],
      station: ['', [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ]],
      type: ['', [
        Validators.required
      ]],
      amount: ['', [
        Validators.required,
        Validators.min(1)
      ]],
      price: ['', [
        Validators.required,
        Validators.min(1),
      ]],
      currency: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      mileage: ['', [
        Validators.required,
        Validators.min(0),
        Validators.maxLength(7)
      ]]
    })
  }

  changeFuelType(e){
    var str = e.target.value.split(" ");
    this.type.setValue(str[1]);   
  }

  changeCurrency(e){
    var str = e.target.value.split(" ");
    this.currency.setValue(str[1]);    
  }

  save(){
    const refill = this.addFuel.value;
    this.carService.addFuel(refill);
    this.navigateTo('service/fuel');

  }

  navigateTo(url){
    this.router.navigate(['user/' + url]);
  }

  get date(){
    return this.addFuel.get('date');
  }

  get station(){
    return this.addFuel.get('station');
  }

  get type(){
    return this.addFuel.get('type');
  }

  get amount(){
    return this.addFuel.get('amount');
  }

  get price(){
    return this.addFuel.get('price');
  }

  get currency(){
    return this.addFuel.get('currency');
  }

  get mileage(){
    return this.addFuel.get('mileage');
  }
}
