import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema, FuelSchema, InsuranceSchema, RepairSchema, TollSchema, UserSchema } from 'src/models/user.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { CarPicturesSchema, UserPicturesSchema } from 'src/models/pictures.model';
import { PicturesController } from 'src/pictures/pictures.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'Car', schema: CarSchema}]),
    MongooseModule.forFeature([{name: 'Fuel', schema: FuelSchema}]),
    MongooseModule.forFeature([{name: 'Repair', schema: RepairSchema}]),
    MongooseModule.forFeature([{name: 'Toll', schema: TollSchema}]),
    MongooseModule.forFeature([{name: 'Insurance', schema: InsuranceSchema}]),
    MongooseModule.forFeature([{name: 'CarPictures', schema: CarPicturesSchema}]),
    MongooseModule.forFeature([{name: 'UserPictures', schema: UserPicturesSchema}]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController, PicturesController],
})
export class UsersModule {}
