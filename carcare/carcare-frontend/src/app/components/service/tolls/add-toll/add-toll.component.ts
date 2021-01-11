import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-add-toll',
  templateUrl: './add-toll.component.html',
  styleUrls: ['./add-toll.component.scss']
})
export class AddTollComponent implements OnInit {
  car: Car;
  addToll: FormGroup;
  durations = ['Weekly', 'Monthly', 'Yearly'];

  constructor(private fb: FormBuilder, private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => this.car = car);

    this.addToll = this.fb.group({
      purchase_date: ['', [
        Validators.required        
      ]],
      duration: [this.durations[0], [
        Validators.required
      ]],
      country: ['', [
        Validators.required
      ]],
      region: ['', [
        Validators.required
      ]]
    })
  }

  changeDuration(e){
    var str = e.target.value.split(" ");
    this.duration.setValue(str[1]);   
  }

  save(){
    const toll = this.addToll.value;
    this.carService.addToll(toll);
    this.navigateTo('service/tolls');

  }

  navigateTo(url){
    this.router.navigate(['user/' + url]);
  }

  get purchase_date(){
    return this.addToll.get('purchase_date');
  }

  get duration(){
    return this.addToll.get('duration');
  }

  get country(){
    return this.addToll.get('country');
  }

  get region(){
    return this.addToll.get('region');
  }

}
