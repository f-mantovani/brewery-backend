import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Beer } from './schemas/beer.schema';
import { Model, Types } from 'mongoose';
import { CreateBeerDto, UpdateBeerDto } from './dto';

@Injectable()
export class BeersService {
  constructor(@InjectModel(Beer.name) private beerModel: Model<Beer>) {}

  async createBeer(createBeerDto: CreateBeerDto) {
    return this.beerModel.create(createBeerDto);
  }

  async getBeers() {
    return this.beerModel.find();
  }

  async getBeerById(id: Types.ObjectId) {
    return this.beerModel.findById(id);
  }

  async getRandomBeer() {
    const count = await this.beerModel.estimatedDocumentCount();
    const randomDocument = Math.floor(Math.random() * count);
    return this.beerModel.findOne().skip(randomDocument);
  }

  async searchBeer(query: string) {
    return this.beerModel.find({ name: { $regex: query } });
  }

  async updateBeerById(id: Types.ObjectId, updateDto: UpdateBeerDto) {
    return this.beerModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async deleteBeerById(id: Types.ObjectId) {
    return this.beerModel.findByIdAndDelete(id);
  }
}
