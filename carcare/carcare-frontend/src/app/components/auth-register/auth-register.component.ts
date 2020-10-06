import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['../auth-login/auth-login.component.scss']
})
export class AuthRegisterComponent implements OnInit {

  regForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.regForm = this.fb.group({
      username: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required,
      ]]
    }, { validator: MustMatch('password', 'confirmPassword') });
  }

  register(){
    const reg = this.regForm.value;
    this.authService.register(reg).subscribe(result => {
      console.log(result);
    });
    
  }

  get username(){
    return this.regForm.get('username');
  }

  get email(){
    return this.regForm.get('email');
  }

  get password(){
    return this.regForm.get('password');
  }

  get confirmPassword(){
    return this.regForm.get('confirmPassword');
  }

}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}
