import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MustMatch } from '../../auth-register/auth-register.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  changePassword: FormGroup;
  user: User;
  msg: string = ''
  constructor(private userService: UserService, private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.changePassword = this.fb.group({
      password: ['', [
        Validators.required
      ]],
      new_password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirm_new_password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    }, { validator: MustMatch('new_password', 'confirm_new_password') });
  }

  savePassword(){
    this.msg = '';
    const changePw = this.changePassword.value;
    delete changePw.confirm_new_password;
    this.changePassword.reset();
    this.authService.changePassword(changePw).subscribe(res => {
      if(res == 200){
        this.msg = 'SAVED';
      } else {
        this.msg = 'UNAUTHORIZED';
      }
    });
  }

  navigateTo(url){
    this.router.navigate(['user/home/']);
  }


  get password(){
    return this.changePassword.get('password');
  }
  get new_password(){
    return this.changePassword.get('new_password');
  }
  get confirm_new_password(){
    return this.changePassword.get('confirm_new_password');
  }
}
