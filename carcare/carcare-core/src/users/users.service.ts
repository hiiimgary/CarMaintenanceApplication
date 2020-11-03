import { HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose' 
import { timeStamp } from 'console';
import { Model } from 'mongoose';
import { Car, CarDTO, Fuel, FuelDTO, User } from '../models/user.model';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>, 
    @InjectModel('Car') private readonly CarModel: Model<Car>,
    @InjectModel('Fuel') private readonly FuelModel: Model<Fuel>) {}

  async registerUser(username: string, email: string, password: string){
    var user = await this.findUsername(username);
    var userEmail = await this.findEmail(email);
    if(!user && !userEmail){
      const newUser = new this.userModel({
        username,
        email,
        password
      });
      const result = await newUser.save();
      console.log(result);
      return HttpStatus.CREATED;
    } else {
      return HttpStatus.UNAUTHORIZED;
    }


  }

  async findEmail(email: string): Promise<User>{
    let user;
    try{
      user = await this.userModel.findOne({email: email});
    } catch(error) {
      throw new NotFoundException('Could not find user!');
    }
    
    return user;
  }

  async findUsername(username: string): Promise<User>{
    let user;
    try{
      user = await this.userModel.findOne({username: username});
    } catch(error) {
      throw new NotFoundException('Could not find user!');
    }
    
    return user;
  }


  async addCar(user: any, car: CarDTO){
    console.log(user, car);
    const actualUser = await this.findUsername(user.username);
    const newCar = new this.CarModel({
      default: car.default,
      license_plate: car.license_plate,
      brand: car.brand,
      car_model: car.car_model,
      fuel_type: car.fuel_type,
      vin: car.vin,
      release_year: car.release_year
    })
    if(actualUser.cars == undefined){
      actualUser.cars = [];
    }
    var length = actualUser.cars.push(newCar);
    const result = await actualUser.save();
    var insertedCar = result.cars[length-1]; 
    return insertedCar;
  }

  async addFuel(user: any, car_id: string, fuel: FuelDTO){
    const actualUser = await this.findUsername(user.username);
    const newRefill = new this.FuelModel({
      date: fuel.date,
      station: fuel.station,
      type: fuel.type,
      amount: fuel.amount,
      price: fuel.price,
      currency: fuel.currency,
      mileage: fuel.mileage
    });

    

    var actualCar = actualUser.cars.find(car => car._id == car_id);

    
    if(actualCar.refueling == null || actualCar.refueling == undefined){
      actualCar.refueling = [];
    }
    var index = actualCar.refueling.push(newRefill);
    const res = await actualUser.save();
    var c = res.cars.find(car => car._id == car_id);
    return c.refueling[index-1];
  }

}