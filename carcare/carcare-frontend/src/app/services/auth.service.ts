import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient, private _globals: Globals) { }

  login(user: {username: string, password: string}){
    return this._http.post(environment.backendURL + 'auth/login', user);
  }

  register(user: {username: string, email: string, password: string}){
    return this._http.post(environment.backendURL + "auth/registration", user);
  }

  changePassword(payload: {password: string, new_password: string}){
    return this._http.post(environment.backendURL + "auth/change-password", payload);
  }

  isLoggedin(){
    return !!localStorage.getItem('access_token');
  }
}
