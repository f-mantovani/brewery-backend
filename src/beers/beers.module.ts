import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Beer, BeerSchema } from './schemas/beer.schema';
import { BeersController } from './beers.controller';
import { BeersService } from './beers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Beer.name, schema: BeerSchema }]),
  ],
  controllers: [BeersController],
  providers: [BeersService],
})
export class BeersModule {}
