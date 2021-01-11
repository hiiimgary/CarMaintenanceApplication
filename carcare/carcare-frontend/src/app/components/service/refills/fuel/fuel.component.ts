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
  @Input() lastMileage: number;
  consumption: number;
  isOpen: boolean = false;
  isPicture: boolean = false;
  picture: string = '';
  constructor(private carService: CarService) { }

  ngOnInit(): void {
    let distance = this.fuel.mileage - this.lastMileage;
    this.consumption = this.fuel.amount / distance * 100;
    this.consumption = Math.round((this.consumption + Number.EPSILON) * 10) / 10;
  }

  open(){
    this.isOpen = !this.isOpen;
    if(!this.isOpen){
      this.isPicture = false;
    }
  }

  showPicture(){
    this.isPicture = !this.isPicture;
    if(this.fuel.bill && this.isPicture){
      this.carService.getFuelBill(this.fuel.bill).subscribe(res => {
        if(res != 404){
          const pic = res as any;
          this.picture = pic.picture;
        }
      })
    }
  }

  delete(){
    this.carService.deleteFuel(this.fuel._id);
  }
}
