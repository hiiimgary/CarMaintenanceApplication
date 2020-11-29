import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { PicturesController } from './pictures/pictures.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

//'mongodb+srv://hiimgary:bc5nwmCFW54pWBe@database.nzfdb.mongodb.net/carcare-db?retryWrites=true&w=majority'
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front'),
    }),
    MongooseModule.forRoot('mongodb+srv://hiimgary:bc5nwmCFW54pWBe@database.nzfdb.mongodb.net/carcare-db?retryWrites=true&w=majority'),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController, PicturesController],
  providers: [AppService],
})
export class AppModule {}
