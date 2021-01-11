import { HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { CarPictures, FuelPicture, Picture, RepairPicture, UserPictures } from 'src/models/pictures.model';
import { Car, CarDTO, Deadline, DeadlineDTO, DeadlineStatus, Fuel, FuelDTO, Insurance, InsuranceDTO, Repair, RepairDTO, Toll, TollDTO, User } from '../models/user.model';

const Tesseract = require('tesseract.js');
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Car') private readonly CarModel: Model<Car>,
    @InjectModel('Fuel') private readonly FuelModel: Model<Fuel>,
    @InjectModel('Repair') private readonly RepairModel: Model<Repair>,
    @InjectModel('Toll') private readonly TollModel: Model<Toll>,
    @InjectModel('Insurance') private readonly InsuranceModel: Model<Insurance>,
    @InjectModel('Deadline') private readonly DeadlineModel: Model<Deadline>,
    @InjectModel('UserPictures') private readonly userPicturesModel: Model<UserPictures>,
    @InjectModel('FuelPicture') private readonly fuelPictureModel: Model<FuelPicture>,
    @InjectModel('RepairPicture') private readonly repairPictureModel: Model<RepairPicture>,
    @InjectModel('CarPictures') private readonly carPicturesModel: Model<CarPictures>) { }

  async registerUser(username: string, email: string, password: string) {
    var user = await this.findUsername(username);
    var userEmail = await this.findEmail(email);
    if (!user && !userEmail) {
      let encryptedPassword = await this.hashPassword(password).toPromise();
      const newUser = new this.userModel({
        username,
        email,
        password: encryptedPassword
      });

      const newUserGallery = new this.userPicturesModel({
        username: username,
        cars: []
      });
      const res = await newUserGallery.save();
      newUser.pictures = res._id;


      const result = await newUser.save();
      return HttpStatus.CREATED;
    } else {
      return HttpStatus.UNAUTHORIZED;
    }


  }

  async changePassword(username: string, password: string, new_password: string){
    const user = await this.findUsername(username);
    if(user){
      let match = await this.comparePasswords(password, user.password).toPromise();
      if(match){
        let newPass = await this.hashPassword(new_password).toPromise();
        user.password = newPass;
        await user.save();
        return HttpStatus.OK
      }
    }
    return HttpStatus.UNAUTHORIZED;
  }

  hashPassword(password: string) {
    return from<string>(bcrypt.hash(password, 5));

  }

  comparePasswords(newPassword: string, hash: string): Observable<any | boolean> {
    return of<any | boolean>(bcrypt.compare(newPassword, hash));
  }

  async findEmail(email: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findOne({ email: email });
    } catch (error) {
      throw new NotFoundException('Could not find user!');
    }

    return user;
  }

  async findUsername(username: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findOne({ username: username });
    } catch (error) {
      throw new NotFoundException('Could not find user!');
    }

    return user;
  }


  async addUserGallery(username: string, id: string) {
    const actualUser = await this.findUsername(username);
    actualUser.pictures = id;
    const res = await actualUser.save();
    if (res.pictures == id) {
      return true;
    } else {
      return false;
    }
  }

  async addCar(user: any, car: CarDTO) {
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

    const userGallery = await this.getUserGallery(user.username);
    const newCarGallery = new this.carPicturesModel({
      car_id: newCar._id,
      pictures: [],
      repair_bills: [],
      fuel_bills: []
    });
    userGallery.cars.push(newCarGallery);
    await userGallery.save();

    newCar.pictures = newCarGallery._id;

    if (actualUser.cars == undefined) {
      actualUser.cars = [];
    }
    var length = actualUser.cars.push(newCar);
    await actualUser.save();

    return newCar;
  }

  async updateCar(user: any, car_id: string, carUpdate: CarDTO){
    const actualUser = await this.findUsername(user.username);
    if(actualUser){
      const car = actualUser.cars.find(car => car._id == car_id);
      if(car){
        car.license_plate = carUpdate.license_plate;
        car.brand = carUpdate.brand;
        car.car_model = carUpdate.car_model;
        car.fuel_type = carUpdate.fuel_type;
        car.vin = carUpdate.vin;
        car.release_year = carUpdate.release_year;

        await actualUser.save();
        return HttpStatus.OK;
      }
    }
    return HttpStatus.BAD_REQUEST;
  }

  async changeActiveCar(user: any, car_id: string) {
    const actualUser = await this.findUsername(user.username);
    let found = false;
    actualUser.cars.forEach(car => {
      if (car._id == car_id) {
        car.default = true;
        found = true;
      } else {
        car.default = false;
      }

    })
    if (!found) {
      return HttpStatus.NOT_FOUND;
    }
    const save = actualUser.save();
    return HttpStatus.OK;
  }

  async addFuel(user: any, car_id: string, fuel: FuelDTO) {
    const actualUser = await this.findUsername(user.username);
    const newRefill = new this.FuelModel({
      date: fuel.date,
      station: fuel.station,
      type: fuel.type,
      amount: fuel.amount,
      price: fuel.price,
      currency: fuel.currency,
      mileage: fuel.mileage,
      bill: null
    });

    if (fuel.bill) {
      const userGallery = await this.getUserGallery(user.username);
      const carGallery = userGallery.cars.find(car => car.car_id == car_id);
      const fuelPicture = new this.fuelPictureModel({
        picture: fuel.bill
      })

      newRefill.bill = fuelPicture._id;

      if (!carGallery.fuel_bills) {
        carGallery.fuel_bills = [];
      }
      carGallery.fuel_bills.push(fuelPicture);

      await userGallery.save();
    }

    var actualCar = actualUser.cars.find(car => car._id == car_id);

    if (actualCar.refueling == null || actualCar.refueling == undefined) {
      actualCar.refueling = [];
    }
    var index = actualCar.refueling.push(newRefill);
    actualCar.refueling.sort((a, b) => {
      let d1 = new Date(a.date); let d2 = new Date(b.date);
      let same = d1.getTime() === d2.getTime();
      if (same) {
        if(a.mileage > b.mileage){
          return -1;
        } else {
          return 1;
        }
      }
      if (d1 > d2) return -1;
      if (d1 < d2) return 1;
    });
    const res = await actualUser.save();
    var c = res.cars.find(car => car._id == car_id);
    return newRefill;
  }

  async deleteFuel(user: any, car_id: string, fuel_id: string) {
    const actualUser = await this.findUsername(user.username);
    const actualCar = actualUser.cars.find(car => car._id == car_id);
    if (actualCar == null) {
      return HttpStatus.BAD_REQUEST;
    }
    const fuel = actualCar.refueling.find(fuel => fuel._id == fuel_id);
    if (fuel == null) {
      return HttpStatus.BAD_REQUEST;
    }
    if (fuel.bill != null) {
      const userGallery = await this.getUserGallery(user.username);
      const carGallery = userGallery.cars.find(car => car.car_id == car_id);
      const picture = carGallery.fuel_bills.find(f => f._id == fuel.bill);
      await picture.remove();
      await userGallery.save();
    }
    const del = await fuel.remove();
    const res = await actualUser.save();
    return HttpStatus.OK;
  }

  async addRepair(user: any, car_id: string, repair: RepairDTO) {
    const actualUser = await this.findUsername(user.username);
    const newRepair = new this.RepairModel({
      diy: repair.diy,
      date: repair.date,
      mileage: repair.mileage,
      bills: null,
      service: repair.service,
      parts: repair.parts
    });

    if (repair.bills) {
      const userGallery = await this.getUserGallery(user.username);
      const carGallery = userGallery.cars.find(car => car.car_id == car_id);
      const repairPicture = new this.repairPictureModel({
        pictures: repair.bills
      });

      newRepair.bills = repairPicture._id;

      if (!carGallery.repair_bills) {
        carGallery.repair_bills = [];
      }
      carGallery.repair_bills.push(repairPicture);

      await userGallery.save();
    }

    var actualCar = actualUser.cars.find(car => car._id == car_id);
    if (actualCar.repairs == null || actualCar.repairs == undefined) {
      actualCar.repairs = [];
    }
    var index = actualCar.repairs.push(newRepair);
    const res = await actualUser.save();
    var c = res.cars.find(car => car._id == car_id);
    return c.repairs[index - 1];
  }

  async deleteRepair(user: any, car_id: string, repair_id: string) {
    const actualUser = await this.findUsername(user.username);
    const actualCar = actualUser.cars.find(car => car._id == car_id);
    if (actualCar == null) {
      return HttpStatus.BAD_REQUEST;
    }
    const repair = actualCar.repairs.find(repair => repair._id == repair_id);
    if (repair == null || repair == undefined) {
      return HttpStatus.BAD_REQUEST;
    }

    if (repair.bills != null) {
      const userGallery = await this.getUserGallery(user.username);
      const carGallery = userGallery.cars.find(car => car.car_id == car_id);
      const picture = carGallery.repair_bills.find(f => f._id == repair.bills);
      await picture.remove();
      await userGallery.save();
    }

    const del = await repair.remove();
    const res = await actualUser.save();
    return HttpStatus.OK;
  }

  async addToll(user: any, car_id: string, toll: TollDTO) {
    const actualUser = await this.findUsername(user.username);
    const newToll = new this.TollModel({
      purchase_date: toll.purchase_date,
      expiration: toll.expiration,
      duration: toll.duration,
      country: toll.country,
      region: toll.region
    });
    var actualCar = actualUser.cars.find(car => car._id == car_id);

    if (actualCar.tolls == null || actualCar.tolls == undefined) {
      actualCar.tolls = [];
    }

    var index = actualCar.tolls.push(newToll);
    const res = await actualUser.save();
    var c = res.cars.find(car => car._id == car_id);
    return c.tolls[index - 1];
  }

  async deleteToll(user: any, car_id: string, toll_id: string) {
    const actualUser = await this.findUsername(user.username);
    const actualCar = actualUser.cars.find(car => car._id == car_id);
    if (actualCar == null) {
      return HttpStatus.BAD_REQUEST;
    }
    const toll = actualCar.tolls.find(toll => toll._id == toll_id);
    if (toll == null) {
      return HttpStatus.BAD_REQUEST;
    }
    const del = await toll.remove();
    const res = await actualUser.save();
    return HttpStatus.OK;
  }

  async addInsurance(user: any, car_id: string, insurance: InsuranceDTO) {
    const actualUser = await this.findUsername(user.username);
    const newInsurance = new this.InsuranceModel({
      service_provider: insurance.service_provider,
      type: insurance.type,
      first_deadline: insurance.first_deadline,
      interval: insurance.interval,
      bonus_malus: insurance.bonus_malus,
      fee: insurance.fee,
      currency: insurance.currency
    });
    var actualCar = actualUser.cars.find(car => car._id == car_id);

    if (actualCar.insurances == null || actualCar.insurances == undefined) {
      actualCar.insurances = [];
    }

    var index = actualCar.insurances.push(newInsurance);
    const res = await actualUser.save();
    var c = res.cars.find(car => car._id == car_id);
    return c.insurances[index - 1];
  }

  async deleteInsurance(user: any, car_id: string, insurance_id: string) {
    const actualUser = await this.findUsername(user.username);
    const actualCar = actualUser.cars.find(car => car._id == car_id);
    if (actualCar == null) {
      return HttpStatus.BAD_REQUEST;
    }
    const insurance = actualCar.insurances.find(insurance => insurance._id == insurance_id);
    if (insurance == null) {
      return HttpStatus.BAD_REQUEST;
    }
    const del = await insurance.remove();
    const res = await actualUser.save();
    return HttpStatus.OK;
  }

  async addDeadline(user: any, car_id: string, deadline: DeadlineDTO) {
    const actualUser = await this.findUsername(user.username);
    const newDeadline = new this.DeadlineModel({
      deadline: deadline.deadline,
      title: deadline.title,
      description: deadline.description,
      status: deadline.status,
      price: deadline.price,
      currency: deadline.currency,
      repeating: deadline.repeating,
      days: deadline.days,
      months: deadline.months,
      years: deadline.years
    });
    var actualCar = actualUser.cars.find(car => car._id == car_id);
    if (actualCar.calendar == null || actualCar.calendar == undefined) {
      actualCar.calendar = [];
    }

    actualCar.calendar.push(newDeadline);

    const res = await actualUser.save();
    return newDeadline;
  }

  async deleteDeadline(user: any, car_id: string, deadline_id: string) {
    const actualUser = await this.findUsername(user.username);
    const actualCar = actualUser.cars.find(car => car._id == car_id);
    if (actualCar == null) {
      return HttpStatus.BAD_REQUEST;
    }
    const deadline = actualCar.calendar.find(deadline => deadline._id == deadline_id);
    if (deadline == null) {
      return HttpStatus.BAD_REQUEST;
    }
    const del = await deadline.remove();
    const res = await actualUser.save();
    return HttpStatus.OK;
  }

  async markDeadline(user: any, car_id: string, deadline_id: string, status: DeadlineStatus) {
    const actualUser = await this.findUsername(user.username);
    const actualCar = actualUser.cars.find(car => car._id == car_id);
    if (actualCar == null) {
      return HttpStatus.BAD_REQUEST;
    }
    const deadline = actualCar.calendar.find(deadline => deadline._id == deadline_id);
    if (deadline == null) {
      return HttpStatus.BAD_REQUEST;
    }
    deadline.status = status;
    const res = await actualUser.save();
    return HttpStatus.OK;
  }

  async uploadProfilePicture(user: any, picture: string) {
    const actualUser = await this.findUsername(user.username);
    actualUser.profile_picture = picture;
    const res = await actualUser.save();
    if (actualUser.profile_picture == res.profile_picture) {
      return HttpStatus.OK;
    } else {
      return HttpStatus.BAD_REQUEST;
    }
  }

  async carPictures(user: any, car_gallery_id: string) {
    const gallery = await this.getCarGallery(user, car_gallery_id);
    if (!gallery) {
      return HttpStatus.NOT_FOUND;
    } else {
      return gallery.pictures;
    }
  }

  async getCarGallery(user: any, car_gallery_id: string) {
    const gallery = await this.getUserGallery(user.username);
    const car = gallery.cars.find(car => car._id == car_gallery_id);
    if (!car) {
      return null;
    } else {
      return car;
    }
  }

  async getFuelBill(user: any, car_gallery_id: string, picture_id: string) {
    const carPictures = await this.getCarGallery(user, car_gallery_id);
    if (!carPictures) {
      return HttpStatus.NOT_FOUND;
    }
    const pic = carPictures.fuel_bills.find(f => f._id == picture_id);
    if (pic) {
      return pic;
    } else {
      return HttpStatus.NOT_FOUND;
    }
  }

  async getRepairBill(user: any, car_gallery_id: string, picture_id: string) {
    const carPictures = await this.getCarGallery(user, car_gallery_id);
    if (!carPictures) {
      return HttpStatus.NOT_FOUND;
    }
    const pic = carPictures.repair_bills.find(f => f._id == picture_id);
    if (pic) {
      return pic;
    } else {
      return HttpStatus.NOT_FOUND;
    }
  }

  async addCarPicture(user: any, car_gallery_id: string, car_id: string, picture: Picture) {
    const userGallery = await this.getUserGallery(user.username);
    const car = userGallery.cars.find(car => car._id == car_gallery_id);
    car.pictures.push(picture);
    await userGallery.save();
    return HttpStatus.OK;

  }

  async getUserGallery(username: string) {
    const actualUser = await this.findUsername(username);

    const userGallery = await this.findUserGallery(actualUser.pictures);
    return userGallery;
  }

  async findUserGallery(id: string): Promise<UserPictures> {
    let userPics;
    try {
      userPics = await this.userPicturesModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find gallery!');
    }

    return userPics;
  }

  async getProfilePicture(username: string) {
    const user = await this.findUsername(username);
    if (user) {
      return { picture: user.profile_picture };
    } else {
      return HttpStatus.NOT_FOUND;
    }
  }

}