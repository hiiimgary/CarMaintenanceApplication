import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, CommunitySchema, PostSchema } from 'src/models/community.model';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';

@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature([{name: 'Community', schema: CommunitySchema}]),
        MongooseModule.forFeature([{name: 'Post', schema: PostSchema}]),
        MongooseModule.forFeature([{name: 'Comment', schema: CommentSchema}]),
    ],
    providers: [CommunityService, UsersService],
    controllers: [CommunityController],
    exports: [
        MongooseModule.forFeature([{name: 'Community', schema: CommunitySchema}]),
        MongooseModule.forFeature([{name: 'Post', schema: PostSchema}]),
        MongooseModule.forFeature([{name: 'Comment', schema: CommentSchema}]),
    ]
})
export class CommunityModule {}
