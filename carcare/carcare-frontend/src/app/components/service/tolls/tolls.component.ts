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
    this.carService.activeCar.subscribe(car => {
      this.car = car;
      car.tolls.sort((a, b) => {
        let d1 = new Date(a.purchase_date); let d2 = new Date(b.purchase_date);
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;
        if (d1 > d2) return -1;
        if (d1 < d2) return 1;
      });
    });
  }

  isExpired(expiration: Date){
    let now = new Date();
    return expiration < now ? true : false;
  }

  navigateTo(url: string){
    this.router.navigate(['user/' + url]);
  }

}
