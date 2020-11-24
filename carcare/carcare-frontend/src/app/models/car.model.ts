export interface Car {
    _id: string;
    default: boolean,
    license_plate: string;
    brand: string;
    car_model: string;
    fuel_type: string;
    vin: string;
    release_year: string;
    refueling?: Fuel[];
    repairs?: Repair[];
    tolls?: Toll[];
    insurances?: Insurance[];
    calendar?: Deadline[];
    pictures?: string;
}

export interface Fuel {
    _id: string;
    date: string;
    station: string;
    type: FuelType;
    amount: number;
    price: number;
    currency: Currency;
    mileage: number;
}

export enum FuelType {
    gasoline = "Gasoline",
    diesel = "Diesel"
}

export interface Repair{
    _id: string;
    diy: boolean;
    date: string;
    mileage: number;
    service?: Service;
    parts?: Part[];
}

export interface Service{
    company_name: string;
    company_address?: string;
    description: string;
    fee: number;
    currency: Currency;
}

export interface Part{
    name: string;
    reason_of_interchange: string;
    price: number;
    currency: Currency;
}

export enum Currency {
    HUF = "HUF",
    EUR = "EUR",
    USD = "USD"
}

export interface Toll {
    _id: string;
    purchase_date: string;
    expiration: string;
    duration: string;
    region: string;
    country: string;
}

export interface Insurance {
    _id: string;
    service_provider: string;
    type: InsuranceType;
    first_deadline: string;
    interval: Interval;
    bonus_malus?: string;
    fee: number;
    currency: Currency;
}

export enum InsuranceType{
    ThirdPartyOnly = "3rd party only",
    FullyCoprehensive = "Fully coprehensive"
}

export enum Interval{
    yearly = "Yearly",
    quarterly = "Quarterly"
}

export interface Deadline {
    _id: string;
    deadline: Date;
    title: string;
    description?: string;
    price: number;
    currency: Currency;
    status: DeadlineStatus;
    repeating: boolean;
    days?: number;
    months?: number;
    years?: number;
}

export enum DeadlineStatus {
    pending = "Pending",
    done = "Done",
    past_due = "Past Due"
}

