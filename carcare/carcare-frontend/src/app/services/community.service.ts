import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ProfilePicture{
  username: string;
  subject: any;
  picture: Observable<string>;
}

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  profilePictures: ProfilePicture[] = [];

  constructor(private _http: HttpClient, private _datepipe: DatePipe) { }

  getCommunity(manufacturer: string){
    return this._http.get(environment.backendURL + 'community/get/' + manufacturer);
  }

  //-----------------> POST CRUD <------------------------------

  addPost(community_id: string, content: string){
    return this._http.post(environment.backendURL + 'community/add-post', {community_id, content});
  }

  deletePost(community_id: string, post_id: string){
    return this._http.post(environment.backendURL + 'community/delete-post', {community_id, post_id});

  }

  likePost(community_id: string, post_id: string){
    return this._http.post(environment.backendURL + 'community/like-post', {community_id, post_id});
  }

  //-----------------> COMMENT CRUD <------------------------------


  addComment(community_id: string, post_id: string, content: string){
    return this._http.post(environment.backendURL + 'community/add-comment', {community_id, post_id, content});
  }

  deleteComment(community_id: string, post_id: string, comment_id: string){
    return this._http.post(environment.backendURL + 'community/delete-comment', {community_id, post_id, comment_id});

  }

  likeComment(community_id: string, post_id: string, comment_id: string){
    return this._http.post(environment.backendURL + 'community/like-comment', {community_id, post_id, comment_id});
  }

  //--------------------------> PICTURES <--------------------------------------

  getPicture(username: string){
    const user = this.profilePictures.find(user => user.username == username);
    if(!user){
      const subject = new BehaviorSubject("");
      const picture = subject.asObservable();
      const newUser = {
        username,
        subject,
        picture
      }
      this.profilePictures.push(newUser);
      this.getPictureFromAPI(newUser);
      return newUser.picture;
    } else {
      return user.picture;
    }
    
  }

  getPictureFromAPI(user: ProfilePicture){
    this._http.get(environment.backendURL + 'community/get-profile-picture/' + user.username).subscribe(res => {
      user.subject.next(res);
    })
  }
}
