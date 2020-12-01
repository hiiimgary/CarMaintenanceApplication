import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Http2ServerRequest } from 'http2';
import { Model } from 'mongoose';
import { Comment, CommentDTO, Community, Post, PostDTO } from 'src/models/community.model';

@Injectable()
export class CommunityService {
    constructor(
        @InjectModel('Community') private readonly communityModel: Model<Community>,
        @InjectModel('Post') private readonly postModel: Model<Post>,
        @InjectModel('Comment') private readonly commentModel: Model<Comment>
    ){}

    async getCommunity(user: any, manufacturer: string){
        let community = await this.findCommunity(manufacturer);
        if(community){
            if(!community.users.includes(user.username)){
                community.users.push(user.username);
                const res = await community.save();
            }
            return community;
        } else {
            const newCommunity = new this.communityModel({
                manufacturer: manufacturer.toUpperCase(),
                users: [],
                posts: [] 
            });
            newCommunity.users.push(user.username);
            const res = await newCommunity.save();
            return newCommunity;
        }
    }

    //-----------------------------------> POST CRUD <--------------------------------------

    async addPost(user: any, post: PostDTO){
        const community = await this.communityModel.findById(post.community_id);
        if(community){
            let now = new Date();
            const newPost = new this.postModel({
                date_of_creation: now,
                username: user.username,
                content: post.content,
                user_likes: [],
                comments: []
            });
            community.posts.unshift(newPost);
            const res = await community.save();
            return newPost;
        } else {
            HttpStatus.BAD_REQUEST;
        }
    }

    async deletePost(user: any, community_id: string, post_id: string){
        const community = await this.communityModel.findById(community_id);
        if(!community){
            return HttpStatus.NOT_FOUND;
        }

        const post = community.posts.find(post => post._id == post_id);

        if(!post){
            return HttpStatus.NOT_FOUND;
        }

        if(post.username == user.username){
            const res = await post.remove();
            const save = await community.save();
            return HttpStatus.OK;
        } else {
            return HttpStatus.FORBIDDEN;
        }
    }

    async likePost(user: any, community_id: string, post_id: string){
        const community = await this.communityModel.findById(community_id);
        if(!community){
            return HttpStatus.NOT_FOUND;
        }

        const post = community.posts.find(post => post._id == post_id);

        if(!post){
            return HttpStatus.NOT_FOUND;
        }

        if(post.user_likes.includes(user.username)){
            post.user_likes.filter(u => u != user.username);
        } else {
            post.user_likes.push(user.username);
        }
        const save = await community.save();
        return HttpStatus.OK;
    }

    //-----------------------------------> COMMENT CRUD <--------------------------------------

    async addComment(user: any, comment: CommentDTO){
        const community = await this.communityModel.findById(comment.community_id);
        if(!community){
            return HttpStatus.NOT_FOUND;
        }
        const post = community.posts.find(post => post._id == comment.post_id);
        if(!post){
            return HttpStatus.NOT_FOUND;
        }
        const date = new Date();
        const newComment = new this.commentModel({
            date_of_creation: date,
            username: user.username,
            user_likes: [],
            content: comment.content
        });
        post.comments.push(newComment);
        const save = await community.save();
        return newComment;
    }

    async deleteComment(user: any, community_id: string, post_id: string, comment_id: string){
        const community = await this.communityModel.findById(community_id);
        if(!community){
            return HttpStatus.NOT_FOUND;
        }
        const post = community.posts.find(post => post._id == post_id);
        if(!post){
            return HttpStatus.NOT_FOUND;
        }
        const comment = post.comments.find(comment => comment._id == comment_id);
        if(!comment){
            return HttpStatus.NOT_FOUND;
        }
        const rm = comment.remove();
        const save = await community.save();
        return HttpStatus.OK;
    }

    async likeComment(user: any, community_id: string, post_id: string, comment_id: string){
        const community = await this.communityModel.findById(community_id);
        if(!community){
            return HttpStatus.NOT_FOUND;
        }
        const post = community.posts.find(post => post._id == post_id);
        if(!post){
            return HttpStatus.NOT_FOUND;
        }
        const comment = post.comments.find(comment => comment._id == comment_id);
        if(!comment){
            return HttpStatus.NOT_FOUND;
        }
        if(comment.user_likes.includes(user.username)){
            comment.user_likes = comment.user_likes.filter(u => u != user.username);
        } else {
            comment.user_likes.push(user.username);
        }
        const save = await community.save();
        return HttpStatus.OK;
    }

    async findCommunity(manufacturer: string): Promise<Community> {
        let community;
        try {
          community = await this.communityModel.findOne({ manufacturer: manufacturer.toUpperCase() });
        } catch (error) {
          throw new NotFoundException('Could not find Community!');
        }
    
        return community;
      }
}
