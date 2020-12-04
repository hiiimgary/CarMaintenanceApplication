import { Schema } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import * as mongoose from 'mongoose';

export const FuelSchema = new mongoose.Schema({
    date: {type: String, required: true},
    station: {type: String, required: true},
    type: {type: String, required: true},
    amount: {type: Number, required: true},
    price: {type: Number, required: true},
    currency: {type: String, required: true},
    mileage: {type: Number, required: true},
    bill: {type: String, required: false}
});



export const RepairSchema = new mongoose.Schema({
    diy: {type: Boolean, required: true},
    date: {type: String, required: true},
    mileage: {type: Number, required: true},
    bills: {type: [String], required: false},
    service: {
        company_name: {type: String},
        company_address: {type: String},
        description: {type: String},
        fee: {type: Number},
        currency: {type: String}
    },
    parts: [{
        name: {type: String, required: true},
        reason_of_interchange: {type: String, required: true},
        price: {type: String, required: true},
        currency: {type: String, required: true}
    }]
})

export const TollSchema = new mongoose.Schema({
    purchase_date: {type: String, required: true},
    expiration: {type: String, required: true},
    duration: {type: String, required: true},
    region: {type: String, required: true},
    country: {type: String, required: true}
});

export const InsuranceSchema = new mongoose.Schema({
    service_provider: {type: String, required: true},
    type: {type: String, required: true},
    first_deadline: {type: String, required: true},
    interval: {type: String, required: true},
    bonus_malus: {type: String, required: false},
    fee: {type: Number, required: true},
    currency: {type: String, required: true}
});

export const DeadlineSchema = new mongoose.Schema({
    deadline: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: false},
    status: {type: String, required: true},
    price: {type: String, required: false},
    currency: {type: String, required: false},
    repeating: {type: Boolean, required: true},
    days: {type: Number, required: false},
    months: {type: Number, required: false},
    years: {type: Number, required: false}
});

export const CarSchema = new mongoose.Schema({
    license_plate: {type: String, required: true},
    brand: {type: String, required: true},
    car_model: {type: String, required: true},
    fuel_type: {type: String, required: true},
    vin: {type: String, required: true},
    release_year: {type: Number, required: true},
    default: {type: Boolean, required: true},
    refueling: {type: [FuelSchema], required: false},
    tolls: {type: [TollSchema], required: false},
    insurances: {type: [InsuranceSchema], required: false},
    repairs: {type: [RepairSchema], required: false},
    calendar: {type: [DeadlineSchema], required: false},
    pictures: {type: String, required: false}
});

export const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    profile_picture: {type: String, required: false},
    pictures: {type: String, required: false},
    cars: {type: [CarSchema], required: false}
});

export interface User extends mongoose.Document {
    id: string;
    username: string;
    password: string;
    email: string;
    profile_picture: string;
    cars: Car[];
    pictures?: string;
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
    tolls: Toll[];
    insurances: Insurance[];
    repairs: Repair[];
    calendar: Deadline[];
    pictures?: string;
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
    bill?: string;
}

export class RepairDTO{
    diy: boolean;
    date: string;
    mileage: number;
    bills?: string[];
    service?: Service;
    parts?: Part[];
}

export class Service{
    company_name: string;
    company_address?: string;
    description: string;
    fee: number;
    currency: Currency;
}

export class Part{
    name: string;
    reason_of_interchange: string;
    price: number;
    currency: Currency;
}

export class TollDTO{
    purchase_date: string;
    expiration: string;
    duration: string;
    region: string;
    country: string;
}

export class InsuranceDTO{
    service_provider: string;
    type: string;
    first_deadline: string;
    interval: string;
    bonus_malus?: string;
    fee: number;
    currency: Currency;
}

export class DeadlineDTO {
    deadline: Date;
    title: string;
    description?: string;
    status: string;
    price: number;
    currency: Currency;
    repeating: boolean;
    days?: number;
    months?: number;
    years?: number;
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
    bill?: string;

}

export interface Repair extends mongoose.Document {
    id: string;
    diy: boolean;
    date: string;
    mileage: number;
    bills?: string[];
    service?: Service;
    parts?: Part[];
}

export interface Toll extends mongoose.Document {
    id: string;
    purchase_date: string;
    expiration: string;
    duration: string;
    region: string;
    country: string;
}

export interface Insurance extends mongoose.Document {
    id: string;
    service_provider: string;
    type: string;
    first_deadline: string;
    interval: string;
    bonus_malus?: string;
    fee: number;
    currency: Currency;
}

export interface Deadline extends mongoose.Document {
    id: string;
    deadline: Date;
    title: string;
    description?: string;
    status: string;
    price: number;
    currency: Currency;
    repeating: boolean;
    days?: number;
    months?: number;
    years?: number;
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

export enum DeadlineStatus {
    pending = "Pending",
    done = "Done",
    past_due = "Past Due"
}