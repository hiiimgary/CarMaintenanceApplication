import { Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CarDTO } from 'src/models/user.model';
import { UsersService } from './users.service';



@Controller('api/user')
export class UsersController {

    constructor(private readonly userService: UsersService){}

    @UseGuards(JwtAuthGuard)
    @Post('add-car')
    async addCar(@Req() req ,@Body() car: CarDTO){
        const res = await this.userService.addCar(req.user, car);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-car')
    async updateCar(@Req() req ,@Body() {car, car_id}){
        const res = await this.userService.updateCar(req.user, car_id, car);
        return res;
    }
    

    @UseGuards(JwtAuthGuard)
    @Post('change-default-car')
    async changeActiveCar(@Req() req ,@Body() {car_id}){
        const res = await this.userService.changeActiveCar(req.user, car_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-fuel')
    async addFuel(@Req() req ,@Body() {car_id, fuel}){
        const res = await this.userService.addFuel(req.user, car_id, fuel);
        return res;
    }



    @UseGuards(JwtAuthGuard)
    @Post('delete-fuel')
    async deleteFuel(@Req() req ,@Body() {car_id, fuel_id}){
        const res = await this.userService.deleteFuel(req.user, car_id, fuel_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-repair')
    async addRepair(@Req() req ,@Body() {car_id, repair}){
        const res = await this.userService.addRepair(req.user, car_id, repair);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete-repair')
    async deleteRepair(@Req() req ,@Body() {car_id, repair_id}){
        const res = await this.userService.deleteRepair(req.user, car_id, repair_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-toll')
    async addToll(@Req() req ,@Body() {car_id, toll}){
        const res = await this.userService.addToll(req.user, car_id, toll);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete-toll')
    async deleteToll(@Req() req ,@Body() {car_id, toll_id}){
        const res = await this.userService.deleteToll(req.user, car_id, toll_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-insurance')
    async addInsurance(@Req() req ,@Body() {car_id, insurance}){
        const res = await this.userService.addInsurance(req.user, car_id, insurance);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete-insurance')
    async deleteInsurance(@Req() req ,@Body() {car_id, insurance_id}){
        const res = await this.userService.deleteInsurance(req.user, car_id, insurance_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-deadline')
    async addDeadline(@Req() req ,@Body() {car_id, deadline}){
        const res = await this.userService.addDeadline(req.user, car_id, deadline);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete-deadline')
    async deleteDeadline(@Req() req ,@Body() {car_id, deadline_id}){
        const res = await this.userService.deleteDeadline(req.user, car_id, deadline_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('mark-deadline')
    async markDeadline(@Req() req ,@Body() {car_id, deadline_id, status}){
        const res = await this.userService.markDeadline(req.user, car_id, deadline_id, status);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload-profile-picture')
    async uploadProfilePicture(@Req() req ,@Body() {profilePicture}){
        const res = await this.userService.uploadProfilePicture(req.user, profilePicture);
        return res;
    }
}
