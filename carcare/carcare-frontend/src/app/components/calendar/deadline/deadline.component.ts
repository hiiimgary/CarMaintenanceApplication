import { Component, Input, OnInit } from '@angular/core';
import { Deadline, DeadlineStatus } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-deadline',
  templateUrl: './deadline.component.html',
  styleUrls: ['./deadline.component.scss']
})
export class DeadlineComponent implements OnInit {

  @Input() deadline: Deadline;
  isOpen: boolean = false;
  repeatInterval: string = '';
  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.repeatInterval = 'Every ';
    if(this.deadline.repeating){
      if(this.deadline.years && this.deadline.years != 0){
        this.repeatInterval += this.deadline.years == 1 ? ' year ' : this.deadline.years + ' years '; 
      }
      if(this.deadline.months && this.deadline.months != 0){
        this.repeatInterval += this.deadline.months == 1 ? ' month ' : this.deadline.months + ' months '; 
      }
      if(this.deadline.days && this.deadline.days != 0){
        this.repeatInterval += this.deadline.days == 1 ? ' day' : this.deadline.days + ' days'; 

      }
    }
    let now = new Date();
    let date = new Date(this.deadline.deadline);
    if(now > date && this.deadline.status == DeadlineStatus.pending){
      console.log('eeee');
      this.carService.markDeadline(this.deadline._id, DeadlineStatus.past_due);
    }
  }

  open(){
    this.isOpen = !this.isOpen;
  }

  delete(){
    this.carService.deleteDeadline(this.deadline._id);
  }

  markDone(){
    this.carService.markDeadline(this.deadline._id, DeadlineStatus.done);
    
  }


}
