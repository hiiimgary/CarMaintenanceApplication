import { Binary } from '@angular/compiler';

export interface User{
    username: string;
    email: string;
    profile_picture?: string;
    pictures?: string;
}

export interface Picture {
    upload_date: string;
    picture: string;
}