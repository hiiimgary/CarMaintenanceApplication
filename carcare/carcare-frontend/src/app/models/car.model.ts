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
}

export interface Fuel {
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
    gasoline = "Gasoline",
    diesel = "Diesel"
}

export enum Currency {
    HUF = "HUF",
    EUR = "EUR",
    USD = "USD"
}