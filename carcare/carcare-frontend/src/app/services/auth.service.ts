import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient, private _globals: Globals) { }

  login(user: {username: string, password: string}){
    return this._http.post(this._globals.BASE_URL + 'auth/login', user);
  }

  register(user: {username: string, email: string, password: string}){
    return this._http.post(this._globals.BASE_URL + "auth/registration", user);
  }
}
