import { Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('api/pictures')
export class PicturesController {

    constructor(private usersService: UsersService){}

    @UseGuards(JwtAuthGuard)
    @Get('car-pictures/:gallery_id')
    async carPictures(@Req() req ,@Param() params){
        const res = await this.usersService.carPictures(req.user, params.gallery_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Get('car-pictures/fuel/:gallery_id/:picture_id')
    async fuelBill(@Req() req ,@Param() params){
        const res = await this.usersService.getFuelBill(req.user, params.gallery_id, params.picture_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Get('car-pictures/repair/:gallery_id/:picture_id')
    async repairBill(@Req() req ,@Param() params){
        const res = await this.usersService.getRepairBill(req.user, params.gallery_id, params.picture_id);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-car-picture')
    async addCarPicture(@Req() req ,@Body() {car_gallery_id, car_id, picture}){
        const res = await this.usersService.addCarPicture(req.user, car_gallery_id, car_id, picture);
        return res;
    }
}
