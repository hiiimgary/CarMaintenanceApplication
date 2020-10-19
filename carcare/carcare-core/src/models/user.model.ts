import { isEmail } from 'class-validator';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
});

export interface User extends mongoose.Document {
    id: string;
    username: string;
    password: string;
    email: string;
    cars: Car[];
}

export interface Car extends mongoose.Document {
    id: string;
    license_plate: string;
    brand: string;
    car_model: string;
    vin: string;
    release_year: string;
    refueling: Fuel[];
}

export class CarDTO{
    license_plate: string;
    brand: string;
    car_model: string;
    vin: string;
    release_year: string;
}

export interface Fuel extends mongoose.Document {
    id: string;
    date: string;
    station: string;
    type: FuelType;
    amount: number;
    price: number;
    currency: Currency;
    mileage: number;
}

export enum FuelType {
    gasoline,
    diesel
}

export enum Currency {
    HUF,
    EUR,
    USD
}