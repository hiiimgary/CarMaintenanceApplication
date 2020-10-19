import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.scss']
})
export class GarageComponent implements OnInit {
  cars: Car[];
  constructor(private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.getCars().then(res =>{
      this.cars = res;
    });
  }

  navigateTo(url: string){
    this.router.navigate(['/user/' + url]);
  }

}
