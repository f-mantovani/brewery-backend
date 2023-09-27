import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeersController } from './beers/beers.controller';
import { BeersService } from './beers/beers.service';
import { BeersModule } from './beers/beers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BeerSchema } from './beers/schemas/beer.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
    }),
    BeersModule,
    MongooseModule.forRoot(process.env.MONGODB_URI_CONNECTION),
    MongooseModule.forFeature([{ name: 'Beer', schema: BeerSchema }]),
  ],
  controllers: [AppController, BeersController],
  providers: [AppService, BeersService],
})
export class AppModule {}
