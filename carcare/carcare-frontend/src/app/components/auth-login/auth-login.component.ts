import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/car.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  loginForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private carService: CarService, private indexDB: IndexedDbService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if(localStorage.getItem('user') && localStorage.getItem('access_token') && localStorage.getItem('car')){
      this.router.navigate(['/user/home']);
    }
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
      ]]
    })
  }

  login(){
    this.message = '';
    const login = this.loginForm.value;
    this.authService.login(login).subscribe(result => {
      const res = result as any;
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('cars', JSON.stringify(res.user.cars));
      localStorage.setItem('user', JSON.stringify({username: res.user.username, email: res.user.email, profile_picture: res.user.profile_picture}));
      this.indexDB.setUpDB().then(r => {
        this.indexDB.setJWT(res.access_token);
      });

      this.carService.init().then(r => {
        this.router.navigate(['user/home']);
      });
    }, error => {
      this.message = "Invalid Credentials!";
    });
    
  }

  get username(){
    return this.loginForm.get('username');
  }

  get password(){
    return this.loginForm.get('password');
  }

}
