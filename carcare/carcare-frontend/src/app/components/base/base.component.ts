import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  active: boolean[] = [true, false, false, false];
  constructor(private router: Router, private carService: CarService) { }
  cars: Car[];

  ngOnInit(): void {
    var url = this.router.url;
    if(url.includes("home")) this.active = [true, false, false, false];
    if(url.includes("garage")) this.active = [false, true, false, false];
    if(url.includes("service")) this.active = [false, false, true, false];
    if(url.includes("calendar")) this.active = [false, false, false, true];
    this.carService.getCars();
  }

  home(){
    if(this.active[0]) return;
    this.active = [true, false, false, false];
    this.router.navigate(['/user/home']);
  }

  garage(){
    if(this.active[1]) return;
    this.active = [false, true, false, false];
    this.router.navigate(['/user/garage']);

  }

  service(){
    if(this.active[2]) return;
    this.active = [false, false, true, false];
    this.router.navigate(['/user/service']);

  }

  calendar(){
    if(this.active[3]) return;
    this.active = [false, false, false, true];
    this.router.navigate(['/user/calendar']);

  }
}
