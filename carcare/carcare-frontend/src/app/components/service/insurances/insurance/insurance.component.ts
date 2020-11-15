import { Component, Input, OnInit } from '@angular/core';
import { Insurance } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

  @Input() insurance: Insurance;
  isOpen: boolean = false;
  constructor(private carService: CarService) { }

  ngOnInit(): void {
  }

  open(){
    this.isOpen = !this.isOpen;
  }

  delete(){
    this.carService.deleteInsurance(this.insurance._id);
  }

}
