import { Body, Controller, Post } from '@nestjs/common';
import { createBeerDto } from './dto';
import { BeersService } from './beers.service';

@Controller('beers')
export class BeersController {
  constructor(private beerService: BeersService) {}

  @Post()
  createBeer(@Body() dto: createBeerDto) {
    return this.beerService.create(dto);
  }
}
