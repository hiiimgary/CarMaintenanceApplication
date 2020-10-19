import { Component, Input, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  @Input() car: Car;
  isOpen: boolean = false;
  active: boolean = false;
  constructor(private carsService: CarService) { }

  ngOnInit(): void {
    this.carsService.activeCar.subscribe(active => {
      if(this.car == active){
        this.active = true;
      } else {
        this.active = false;
      }
    })
  }

  open(){
    this.isOpen = !this.isOpen;
  }

  changeActive(){
    this.carsService.changeActiveCar(this.car);
  }

}
