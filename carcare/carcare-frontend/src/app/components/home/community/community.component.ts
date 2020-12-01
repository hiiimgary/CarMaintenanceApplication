import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car.model';
import { Community, Post } from 'src/app/models/community.model';
import { CarService } from 'src/app/services/car.service';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  community: Community;
  car: Car;
  constructor(private communityService: CommunityService, private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => {
      this.car = car;
    });
    this.communityService.getCommunity(this.car.brand).subscribe(res => {
      this.community = res as Community;
    })
  }

  deletePost(post: Post){
    this.communityService.deletePost(this.community._id, post._id).subscribe(res => {
      if(res == 200){
        this.community.posts = this.community.posts.filter(p => p._id != post._id);
      }
    });
  }

  addPost(newPost: string){
    if(newPost != ''){
      this.communityService.addPost(this.community._id, newPost).subscribe(res => {
        if(res != 400){
          const post = res as Post;
          this.community.posts.unshift(post);
        }
      })
    }
  }

}
