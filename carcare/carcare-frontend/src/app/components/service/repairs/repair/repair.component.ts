import { Component, Input, OnInit } from '@angular/core';
import { Repair } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.scss']
})
export class RepairComponent implements OnInit {

  @Input() repair: Repair;
  isOpen: boolean = false;
  repairType: string;
  isPictures: boolean = false;
  pictures: string[] = [];
  constructor(private carService: CarService) { }

  ngOnInit(): void {
    if(this.repair.diy){
      this.repairType = "Self-repair";
    } else {
      this.repairType = "Service-repair";
    }
  }

  open(){
    this.isOpen = !this.isOpen;
    if(!this.isOpen){
      this.isPictures = false;
    }
  }

  delete(){
    this.carService.deleteRepair(this.repair._id);
  }

  showPictures(){
    this.isPictures = !this.isPictures;
    if(this.isPictures && this.repair.bills){
      this.carService.getRepairBill(this.repair.bills).subscribe(res => {
        if(res != 404){
          const pics = res as any;
          this.pictures = pics.pictures;
        }
      })
    }
  }

}
