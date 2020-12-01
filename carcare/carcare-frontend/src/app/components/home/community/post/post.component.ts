import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post, Comment } from 'src/app/models/community.model';
import { CommunityService } from 'src/app/services/community.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() community_id: string;
  @Output() deletePost =  new EventEmitter();
  time: string;
  isOpen: boolean = false;
  username: string;
  
  constructor(private communityService: CommunityService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    this.username = user.username;
    this.getPicture();
    this.time = this.getTimeStamp(this.post.date_of_creation);
    this.post.comments.forEach(comment => {
      
      comment.timestamp = this.getTimeStamp(comment.date_of_creation);
      this.communityService.getPicture(comment.username).subscribe(res => {
        if(res != "" && res != '404'){
          const result = res as any;
          const picture = result.picture;
          comment.profile_picture = picture;
        }
      })
    })
  }

  getTimeStamp(date: Date){
    let now = new Date();
    let posted = new Date(date);
    let minutes = Math.round((now.getTime() - posted.getTime()) / (1000 * 60));
    console.log(minutes);
    if(minutes > 60){
      let hours = Math.round(minutes/60);

      if(hours > 24){
        let days = Math.round(hours/24);

        if(days > 30){
          let months = Math.round(days/30);

          if(months > 12){
            let years = Math.round(months/12);
            return  years + ' years ago';
          } else {
            return months + ' months ago';
          }
        } else {
          return days + 'd';
        }
      } else {
        return hours + 'h';
      }
    } else {
      return minutes + 'm';
    }
  }

  liked(){
    const user = JSON.parse(localStorage.getItem('user'));
    return this.post.user_likes.includes(user.username);
  }

  like(){
    const user = JSON.parse(localStorage.getItem('user'));
    if(this.liked()){
      this.post.user_likes = this.post.user_likes.filter(u => u != user.username);
    } else {
      this.post.user_likes.push(user.username);
    }
    this.communityService.likePost(this.community_id, this.post._id).subscribe(res => {
      if(res != 200){
        const user = JSON.parse(localStorage.getItem('user'));
        if(this.liked()){
          this.post.user_likes = this.post.user_likes.filter(u => u != user.username);
        } else {
          this.post.user_likes.push(user.username);
        }
      }
    })
  }

  isUserPosted(){
    const user = JSON.parse(localStorage.getItem('user'));
    return user.username == this.post.username ? true : false;
  }

  delete(){
    this.deletePost.emit();
  }

  async getPicture(){
    this.communityService.getPicture(this.post.username).subscribe(res => {
      if(res != "" && res != '404'){
        const result = res as any;
        const picture = result.picture;
        this.post.profile_picture = picture;
      }
    })
    
  }

  addComment(content: string){
    this.communityService.addComment(this.community_id, this.post._id, content).subscribe(res => {
      if(res != 404 || res != 500){
        const comment = res as Comment;
        const user = JSON.parse(localStorage.getItem('user'));
        comment.profile_picture = user.profile_picture;
        this.post.comments.push(comment);
      }
    })
  }

  deleteComment(comment_id){
    this.communityService.deleteComment(this.community_id, this.post._id, comment_id).subscribe(res => {
      if(res == 200){
        this.post.comments = this.post.comments.filter(comment => comment._id != comment_id);
      }
    })
  }

}
