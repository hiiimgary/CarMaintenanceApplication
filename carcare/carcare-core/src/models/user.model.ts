import { isEmail } from 'class-validator';
import * as mongoose from 'mongoose';

export const FuelSchema = new mongoose.Schema({
    date: {type: String, required: true},
    station: {type: String, required: true},
    type: {type: String, required: true},
    amount: {type: Number, required: true},
    price: {type: Number, required: true},
    currency: {type: String, required: true},
    mileage: {type: Number, required: true}
});

export const CarSchema = new mongoose.Schema({
    license_plate: {type: String, required: true},
    brand: {type: String, required: true},
    car_model: {type: String, required: true},
    fuel_type: {type: String, required: true},
    vin: {type: String, required: true},
    release_year: {type: Number, required: true},
    default: {type: Boolean, required: true},
    refueling: {type: [FuelSchema], required: false}
});

export const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    cars: {type: [CarSchema], required: false}
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
    default: boolean;
    license_plate: string;
    brand: string;
    car_model: string;
    fuel_type: string;
    vin: string;
    release_year: string;
    refueling: Fuel[];
}

export class CarDTO{
    default: boolean;
    license_plate: string;
    brand: string;
    car_model: string;
    fuel_type: string;
    vin: string;
    release_year: string;
}

export class FuelDTO{
    date: string;
    station: string;
    type: FuelType;
    amount: number;
    price: number;
    currency: Currency;
    mileage: number;
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