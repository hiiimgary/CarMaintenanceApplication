import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-repairs',
  templateUrl: './repairs.component.html',
  styleUrls: ['./repairs.component.scss']
})
export class RepairsComponent implements OnInit {

  car: Car;
  constructor(private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => {
      this.car = car;
      car.repairs.sort((a, b) => {
        let d1 = new Date(a.date); let d2 = new Date(b.date);
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;
        if (d1 > d2) return -1;
        if (d1 < d2) return 1;
      });
    });
  }

  navigateTo(url: string){
    this.router.navigate(['/user/service/' + url]);
  }
}
