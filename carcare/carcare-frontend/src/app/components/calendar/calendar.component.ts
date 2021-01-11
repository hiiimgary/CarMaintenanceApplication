import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car, DeadlineStatus } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  car: Car;
  constructor(private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => {
      this.car = car;
      car.calendar.sort((a, b) => {
        let d1 = new Date(a.deadline); let d2 = new Date(b.deadline);
        let same = d1.getTime() === d2.getTime();
        if(a.status == DeadlineStatus.pending && b.status == DeadlineStatus.pending){
          if (same) return 0;
          if (d1 > d2) return 1;
          if (d1 < d2) return -1;
        } else if((a.status == DeadlineStatus.done || a.status == DeadlineStatus.past_due) && (b.status == DeadlineStatus.done || b.status == DeadlineStatus.past_due)){
          if (same) return 0;
          if (d1 > d2) return -1;
          if (d1 < d2) return 1;
        }

        if(a.status == DeadlineStatus.pending && (b.status == DeadlineStatus.past_due || b.status == DeadlineStatus.done)) return -1;
        if(b.status == DeadlineStatus.pending && (a.status == DeadlineStatus.past_due || a.status == DeadlineStatus.done)) return 1;
      })
    });
  }

  navigateTo(url: string){
    this.router.navigate(['user/' + url]);
  }
}
