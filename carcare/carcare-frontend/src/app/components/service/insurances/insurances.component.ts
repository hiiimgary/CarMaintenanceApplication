import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.scss']
})
export class InsurancesComponent implements OnInit {

  car: Car;
  constructor(private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => {
      this.car = car;
      car.insurances.sort((a, b) => {
        let d1 = new Date(a.first_deadline); let d2 = new Date(b.first_deadline);
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;
        if (d1 > d2) return -1;
        if (d1 < d2) return 1;
      });
    });
  }
  
  navigateTo(url: string){
    this.router.navigate(['user/' + url]);
  }

}
