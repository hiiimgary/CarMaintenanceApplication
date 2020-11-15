import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-tolls',
  templateUrl: './tolls.component.html',
  styleUrls: ['./tolls.component.scss']
})
export class TollsComponent implements OnInit {

  car: Car;
  constructor(private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => this.car = car);
  }

  navigateTo(url: string){
    this.router.navigate(['user/' + url]);
  }

}
