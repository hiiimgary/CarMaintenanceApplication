import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentDTO, PostDTO } from 'src/models/community.model';
import { UsersService } from 'src/users/users.service';
import { CommunityService } from './community.service';

@Controller('api/community')
export class CommunityController {

    constructor(private readonly userService: UsersService, private readonly communityService: CommunityService){}

    // -------------------> POST CRUD <-----------------------------------

    @UseGuards(JwtAuthGuard)
    @Post('add-post')
    async addPost(@Req() req ,@Body() post: PostDTO){
        const res = await this.communityService.addPost(req.user, post);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete-post')
    async deletePost(@Req() req ,@Body() {community_id, post_id}){
        const res = await this.communityService.deletePost(req.user, community_id, post_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('like-post')
    async likePost(@Req() req ,@Body() {community_id, post_id}){
        const res = await this.communityService.likePost(req.user, community_id, post_id);
        return res;
    }

    // -------------------> COMMENT CRUD <-----------------------------------

    @UseGuards(JwtAuthGuard)
    @Post('add-comment')
    async addComment(@Req() req ,@Body() comment: CommentDTO){
        const res = await this.communityService.addComment(req.user, comment);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete-comment')
    async deleteComment(@Req() req ,@Body() {community_id, post_id, comment_id}){
        const res = await this.communityService.deleteComment(req.user, community_id, post_id, comment_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('like-comment')
    async likeComment(@Req() req ,@Body() {community_id, post_id, comment_id}){
        const res = await this.communityService.likeComment(req.user, community_id, post_id, comment_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Get('get/:community')
    async getCommunity(@Req() req ,@Param() params){
        const res = await this.communityService.getCommunity(req.user, params.community);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-profile-picture/:username')
    async getProfilePicture(@Req() req ,@Param() params){
        const res = await this.userService.getProfilePicture(params.username);
        return res;
    }
}
