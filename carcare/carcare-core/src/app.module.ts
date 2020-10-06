import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://hiimgary:bc5nwmCFW54pWBe@database.nzfdb.mongodb.net/carcare-db?retryWrites=true&w=majority'),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
