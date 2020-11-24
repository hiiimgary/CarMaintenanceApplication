import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Car, Currency, DeadlineStatus } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-add-deadline',
  templateUrl: './add-deadline.component.html',
  styleUrls: ['./add-deadline.component.scss']
})
export class AddDeadlineComponent implements OnInit {

  car: Car;
  addDeadline: FormGroup;
  currencyEnum = Currency;
  statusEnum = DeadlineStatus
  keys = Object.keys;
  isRepeating: boolean = false;

  constructor(private fb: FormBuilder, private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => this.car = car);


    this.addDeadline = this.fb.group({
      deadline: ['', [
        Validators.required        
      ]],
      title: ['', [
        Validators.required
      ]],
      description: '',
      status: ['', [
        Validators.required
      ]],
      repeating: ['', [
      ]],
      days: null,
      months: null,
      years: null,
      price: ['', [
        Validators.required
      ]],
      currency: ['', [
        Validators.required
      ]],
    })
  }

  save(){
    const deadline = this.addDeadline.value;
    deadline.repeating = this.isRepeating;
    if(!this.isRepeating){
      deadline.days = null;
      deadline.months = null;
      deadline.years = null;
    }
    this.carService.addDeadline(deadline);
    this.navigateTo('calendar');

  }

  navigateTo(url){
    this.router.navigate(['user/' + url]);
  }

  get deadline(){
    return this.addDeadline.get('deadline');
  }

  get title(){
    return this.addDeadline.get('title');
  }

  get description(){
    return this.addDeadline.get('description');
  }

  get status(){
    return this.addDeadline.get('status');
  }

  get repeating(){
    return this.addDeadline.get('repeating');
  }

  get days(){
    return this.addDeadline.get('days');
  }

  get months(){
    return this.addDeadline.get('months');
  }

  get years(){
    return this.addDeadline.get('years');
  }

  get price(){
    return this.addDeadline.get('price');
  }

  get currency(){
    return this.addDeadline.get('currency');
  }


}
