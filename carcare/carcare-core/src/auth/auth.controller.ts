import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UsersService } from 'src/users/users.service';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}
    
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body('username') username: string, @Body('password') password: string) {
        
      const result = await this.authService.login({username, password});
      return result;
    }

    @Post('registration')
    async registerUser(@Body('username') username: string, @Body('email') email: string, @Body('password') password: string) {
      return this.userService.registerUser(username, email, password);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
}
