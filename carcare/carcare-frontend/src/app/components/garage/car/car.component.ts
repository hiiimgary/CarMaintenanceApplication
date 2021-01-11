import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Car } from 'src/app/models/car.model';
import { Picture } from 'src/app/models/user.model';
import { CarExportService } from 'src/app/services/car-export.service';
import { CarService } from 'src/app/services/car.service';



@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  @Input() car: Car;
  isOpen: boolean = false;
  isPicturesOpen: boolean = false;
  active: boolean = false;
  pictures: Picture[] = [];
  constructor(private carsService: CarService, private router: Router, private imageCompress: NgxImageCompressService, private carExport: CarExportService) { }

  ngOnInit(): void {
    this.carsService.activeCar.subscribe(active => {
      if(this.car == active){
        this.active = true;
      } else {
        this.active = false;
      }
    })
  }

  open(){
    this.isOpen = !this.isOpen;
    if(!this.isOpen) {
      this.isPicturesOpen = false;
    }
  }

  setDefault(){
    if(!this.car.default){
      this.carsService.setDefault(this.car._id);
    }
  }

  changeActive(){
    this.carsService.changeActiveCar(this.car);
  }

  uploadImage(){
    this.imageCompress.uploadFile().then(({image, orientation}) => {
      this.imageCompress.compressFile(image, orientation, 25, 25).then(
        result => {
          this.carsService.UploadPicture(this.car, result);
        }
      )
    });
  }

  showPictures(){
    this.isPicturesOpen = !this.isPicturesOpen;
    if(this.car.pictures && this.isPicturesOpen){
      this.carsService.getCarPictures(this.car.pictures).subscribe(res => {
        const result = res as any;
        this.pictures = result;
      });
    }
  }

  exportCar(){
    this.carExport.generateCarExport(this.car);
  }

  navigateTo(url: string){
      this.router.navigate(['/user/garage/car/' + url]);
  }

  editCar(){
    this.router.navigate(['/user/garage/add-car', {id: this.car._id}]);
  }

}
