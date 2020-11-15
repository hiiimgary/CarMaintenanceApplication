import * as mongoose from 'mongoose';

export const CarPicturesSchema = new mongoose.Schema({
    car_id: {type: String, required: true},
    pictures: [{
        upload_date: {type: String, required: false},
        picture: {type: String, required: false}
    }]
});

export const UserPicturesSchema = new mongoose.Schema({
    username: {type: String, required: true},
    cars: {type: [CarPicturesSchema], required: false}
});



export interface UserPictures extends mongoose.Document {
    id: string;
    username: string;
    cars?: CarPictures[];
}

export interface CarPictures extends mongoose.Document {
    id: string;
    car_id: string;
    pictures?: Picture[];
}

export interface Picture {
    upload_date: string;
    picture: string;
}