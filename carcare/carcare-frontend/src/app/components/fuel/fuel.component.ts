import { Component, Input, OnInit } from '@angular/core';
import { Fuel } from 'src/app/models/car.model';

@Component({
  selector: 'app-fuel',
  templateUrl: './fuel.component.html',
  styleUrls: ['./fuel.component.scss']
})
export class FuelComponent implements OnInit {

  @Input() fuel: Fuel;
  isOpen: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  open(){
    this.isOpen = !this.isOpen;
  }
}
