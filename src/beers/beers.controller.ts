import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBeerDto, UpdateBeerDto } from './dto';
import { BeersService } from './beers.service';
import { Types } from 'mongoose';

@Controller('beers')
export class BeersController {
  constructor(private beerService: BeersService) {}

  @Post('new')
  createBeer(@Body() dto: CreateBeerDto) {
    return this.beerService.createBeer(dto);
  }

  @Get()
  getAllBeers() {
    return this.beerService.getBeers();
  }

  @Get('search')
  searchBeer(@Query('q') query: string) {
    return this.beerService.searchBeer(query);
  }

  @Get('random')
  getRandomBeer() {
    return this.beerService.getRandomBeer();
  }

  @Get(':id')
  getOneBeer(@Param('id') id: Types.ObjectId) {
    return this.beerService.getBeerById(id);
  }

  @Put(':id')
  updateBeer(@Param('id') id: Types.ObjectId, @Body() beerDto: UpdateBeerDto) {
    return this.beerService.updateBeerById(id, beerDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBeer(@Param('id') id: Types.ObjectId) {
    return this.beerService.deleteBeerById(id);
  }
}
