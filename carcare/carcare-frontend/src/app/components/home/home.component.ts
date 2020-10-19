import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  car: Car;
  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => this.car = car);
  }

}
