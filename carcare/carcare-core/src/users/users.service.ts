import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose' 
import { Model } from 'mongoose';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async registerUser(username: string, email: string, password: string){
    const newUser = new this.userModel({
      username,
      email,
      password
    });
    const result = await newUser.save();
    console.log(result);
    return "done";

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


}