import { Component, Input, OnInit } from '@angular/core';
import { Toll } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-toll',
  templateUrl: './toll.component.html',
  styleUrls: ['./toll.component.scss']
})
export class TollComponent implements OnInit {

  @Input() toll: Toll;
  isOpen: boolean = false;
  constructor(private carService: CarService) { }

  ngOnInit(): void {
  }

  open(){
    this.isOpen = !this.isOpen;
  }

  delete(){
    this.carService.deleteToll(this.toll._id);
  }

}
