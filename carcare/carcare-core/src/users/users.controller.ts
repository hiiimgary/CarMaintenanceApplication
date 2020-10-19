import { Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CarDTO } from 'src/models/user.model';
import { UsersService } from './users.service';



@Controller('user')
export class UsersController {

    constructor(private readonly userService: UsersService){}

    @UseGuards(JwtAuthGuard)
    @Post('add-car')
    async addCar(@Req() req ,@Body() car: CarDTO){
        const res = await this.userService.addCar(req.user, car);
    }
}
