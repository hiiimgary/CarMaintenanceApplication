import { Component, Input, OnInit } from '@angular/core';
import { Fuel } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-fuel',
  templateUrl: './fuel.component.html',
  styleUrls: ['./fuel.component.scss']
})
export class FuelComponent implements OnInit {

  @Input() fuel: Fuel;
  isOpen: boolean = false;
  constructor(private carService: CarService) { }

  ngOnInit(): void {
  }

  open(){
    this.isOpen = !this.isOpen;
  }

  delete(){
    this.carService.deleteFuel(this.fuel._id);
  }
}
