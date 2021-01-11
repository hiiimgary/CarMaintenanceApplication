import * as mongoose from 'mongoose';

export const FuelPictureSchema = new mongoose.Schema({
    picture: {type: String, required: false}
});
export const RepairPictureSchema = new mongoose.Schema({
    pictures: {type: [String], required: false}
});

export const CarPicturesSchema = new mongoose.Schema({
    car_id: {type: String, required: true},
    pictures: [{
        upload_date: {type: String, required: false},
        picture: {type: String, required: false}
    }],
    repair_bills: {type: [RepairPictureSchema], required: false},
    fuel_bills: {type: [FuelPictureSchema], required: false}
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
    repair_bills?: RepairPicture[];
    fuel_bills?: FuelPicture[];
}

export interface Picture {
    upload_date?: string;
    picture: string;
}

export interface RepairPicture extends mongoose.Document{
    id: string;
    pictures: string[];
}

export interface FuelPicture extends mongoose.Document{
    id: string;
    picture: string;
}