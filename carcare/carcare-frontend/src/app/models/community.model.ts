export interface Community {
    _id: string;
    manufacturer: string;
    users: string[];
    posts?: Post[] 
}

export interface Post{
    _id: string;
    date_of_creation: Date;
    username: string;
    profile_picture: string;
    content: string;
    user_likes: string[];
    comments?: Comment[];
}

export interface Comment{
    _id: string;
    date_of_creation: Date;
    timestamp?: string;
    username: string;
    profile_picture?: string;
    user_likes: string[];
    content: string;
}