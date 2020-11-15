import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car.model';
import { User } from 'src/app/models/user.model';
import { CarService } from 'src/app/services/car.service';
import { UserService } from 'src/app/services/user.service';
import {NgxImageCompressService} from 'ngx-image-compress';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  car: Car;
  user: User;
  msg: string = '';
  constructor(private carService: CarService, private router: Router, private userService: UserService, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => this.car = car);
    this.user = this.userService.getUser();
    console.log(this.user);

  }

  logout(){
    localStorage.removeItem('cars');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    this.carService.logout();
    this.router.navigate(['']);
  }

  uploadImage(){
    this.imageCompress.uploadFile().then(({image, orientation}) => {
      this.imageCompress.compressFile(image, orientation, 25, 25).then(
        result => {
          this.user.profile_picture = result;
          this.userService.uploadProfilePicture(this.user.profile_picture).subscribe(res => {
            if(res == 200){
              this.msg =  "Picture successfully uploaded!";
              if(localStorage.getItem('user')){
                localStorage.setItem('user', JSON.stringify(this.user));
              }
            } else {
              this.msg = "Something went wrong!";
            }
          })
        }
      )
    });
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'jpeg') {
        return true;
    }
    else {
        return false;
    }
  }

  navigateTo(url){
    this.router.navigate(['/user/home/' + url]);
  }
}
