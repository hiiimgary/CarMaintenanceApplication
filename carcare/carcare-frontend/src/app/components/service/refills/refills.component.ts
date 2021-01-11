import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-refills',
  templateUrl: './refills.component.html',
  styleUrls: ['./refills.component.scss']
})
export class RefillsComponent implements OnInit {
  car: Car;
  years: string[] = [];
  longConsumption: number;
  constructor(private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => {
      this.car = car;
      for(let i = 0; i < this.car.refueling.length; i++){
        let d = new Date(this.car.refueling[i].date)
        this.years.push(d.getFullYear().toString());
      }
      this.years.sort((a, b) => {
        if (a == b) return 0;
        if (a > b) return -1;
        if (a < b) return 1;
      });
      let yearSet = new Set(this.years);
      this.years = [...yearSet];
      if(this.car.refueling.length > 1){
        this.calculateLongTermConsumption();

      }
    });

  }

  calculateLongTermConsumption(){
    let amount = 0;
    let distance = this.car.refueling[0].mileage - this.car.refueling[this.car.refueling.length-1].mileage;
    for(let i = 0; i < this.car.refueling.length - 1; i++){
      amount += this.car.refueling[i].amount;
    }
    this.longConsumption = amount / distance * 100;
    this.longConsumption = Math.round((this.longConsumption + Number.EPSILON) * 10) / 10;
  }


  getYear(date: Date){
    let d = new Date(date);
    return d.getFullYear().toString();
  }

  getMileage(index: number): number{
    if(this.car.refueling.length > index){
      return this.car.refueling[index].mileage;
    } else {
      return null;
    }
  }

  navigateTo(url: string){
    this.router.navigate(['user/' + url]);
  }
}
