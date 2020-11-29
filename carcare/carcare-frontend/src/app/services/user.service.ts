import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Globals } from '../globals';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  constructor(private _http: HttpClient, private _globals: Globals) { 

  }

  getUser(){
    this.user = JSON.parse(localStorage.getItem('user'));
    return this.user;
  }

  uploadProfilePicture(img: string){
    return this._http.post(environment.backendURL + 'user/upload-profile-picture', {profilePicture: img});
  }
}
