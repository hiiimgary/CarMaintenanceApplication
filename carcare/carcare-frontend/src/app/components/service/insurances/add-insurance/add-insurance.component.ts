import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Car, Currency, InsuranceType, Interval } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-add-insurance',
  templateUrl: './add-insurance.component.html',
  styleUrls: ['./add-insurance.component.scss']
})
export class AddInsuranceComponent implements OnInit {
  car: Car;
  addInsurance: FormGroup;
  insuranceTypeEnum = InsuranceType;
  currencyEnum = Currency;
  intervalEnum = Interval;
  keys = Object.keys;

  constructor(private fb: FormBuilder, private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => this.car = car);

    this.addInsurance = this.fb.group({
      service_provider: ['', [
        Validators.required        
      ]],
      type: [InsuranceType.ThirdPartyOnly, [
        Validators.required
      ]],
      first_deadline: ['', [
        Validators.required
      ]],
      interval: [Interval.quarterly, [
        Validators.required
      ]],
      bonus_malus: ['', [
      ]],
      fee: ['', [
        Validators.required
      ]],
      currency: [Currency.HUF, [
        Validators.required
      ]],
    })
  }

  save(){
    const insurance = this.addInsurance.value;
    this.carService.addInsurance(insurance);
    this.navigateTo('service/insurances');

  }

  navigateTo(url){
    this.router.navigate(['user/' + url]);
  }

  get service_provider(){
    return this.addInsurance.get('service_provider');
  }

  get type(){
    return this.addInsurance.get('type');
  }

  get first_deadline(){
    return this.addInsurance.get('first_deadline');
  }

  get interval(){
    return this.addInsurance.get('interval');
  }

  get bonus_malus(){
    return this.addInsurance.get('bonus_malus');
  }

  get fee(){
    return this.addInsurance.get('fee');
  }

  get currency(){
    return this.addInsurance.get('currency');
  }

}
