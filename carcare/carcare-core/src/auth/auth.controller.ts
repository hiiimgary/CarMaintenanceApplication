import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { map } from 'rxjs/operators';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}
    
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body('username') username: string, @Body('password') password: string, @Request() req) {
      const result = await this.authService.login({username, password});
      var user = req.user._doc;
      user.password = '';
      console.log(user);
      var res = {user: user, access_token: result.access_token};
      return res;
    }

    @Post('registration')
    async registerUser(@Body('username') username: string, @Body('email') email: string, @Body('password') password: string) {
      const res = await this.userService.registerUser(username, email, password);
      console.log(res);
      return res;
    }
  
}
