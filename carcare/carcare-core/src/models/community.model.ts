import * as mongoose from 'mongoose';

// -----------------> SCHEMAS <--------------------

export const CommentSchema = new mongoose.Schema({
    date_of_creation: {type: Date, required: true},
    username: {type: String, required: true},
    user_likes: {type: [String], required: false},
    content: {type: String, required: true}
});

export const PostSchema = new mongoose.Schema({
    date_of_creation: {type: Date, required: true},
    username: {type: String, required: true},
    content: {type: String, required: true},
    user_likes: {type: [String], required: false},
    comments: {type: [CommentSchema], required: false}
});

export const CommunitySchema = new mongoose.Schema({
    manufacturer: {type: String, required: true},
    users: {type: [String], required: true},
    posts: {type: [PostSchema], required: false}
});



// -----------------> DOCUMENTS <--------------------

export interface Community extends mongoose.Document {
    id: string;
    manufacturer: string;
    users: string[];
    posts?: Post[] 
}

export interface Post extends mongoose.Document {
    id: string;
    date_of_creation: Date;
    username: string;
    content: string;
    user_likes: string[];
    comments?: Comment[];
}

export interface Comment extends mongoose.Document {
    id: string;
    date_of_creation: Date;
    username: string;
    user_likes: string[];
    content: string;
}


// -----------------> DTOs <--------------------

export interface PostDTO{
    community_id: string;
    content: string;
}

export interface CommentDTO{
    community_id: string;
    post_id: string;
    content: string;
}