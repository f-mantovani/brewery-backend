import { Test, TestingModule } from '@nestjs/testing';
import { BeersService } from './beers.service';
import { getModelToken } from '@nestjs/mongoose';
import { Beer, BeerSchema } from './schemas/beer.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { CreateBeerDto, UpdateBeerDto } from './dto';

describe('BeersService', () => {
  let beerService: BeersService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let beerModel: Model<Beer>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    beerModel = mongoConnection.model(Beer.name, BeerSchema);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeersService,
        { provide: getModelToken(Beer.name), useValue: beerModel },
      ],
    }).compile();

    beerService = module.get<BeersService>(BeersService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should be defined', () => {
    expect(beerService).toBeDefined();
  });

  describe('Create beer', () => {
    it('should create a beer', async () => {
      const newBeer: CreateBeerDto = {
        name: 'New Beer for testing',
      };

      const beer = beerService.createBeer(newBeer);
      await expect(beer).resolves.toHaveProperty('name', newBeer.name);
    });

    it('should throw an error when not passing the name', async () => {
      const newBeer = {};

      //@ts-expect-error
      const beer = () => beerService.createBeer(newBeer);
      await expect(beer).rejects.toThrow();
    });
  });

  describe('All beers', () => {
    it('should get all the beers', async () => {
      const newBeer: CreateBeerDto = {
        name: 'Beer in all the beers',
      };
      await beerService.createBeer(newBeer);
      const beers = beerService.getBeers();
      await expect(beers).resolves.toHaveLength(1);
    });
  });

  describe('One beer', () => {
    it('should get one beer by id', async () => {
      const newBeer: CreateBeerDto = {
        name: 'Beer for one beer',
      };
      const beerId = (await beerService.createBeer(newBeer))._id;
      const beers = beerService.getBeerById(beerId);
      await expect(beers).resolves.toHaveProperty('name', newBeer.name);
    });

    it(`should throw with invalid Id`, async () => {
      //@ts-expect-error
      const beers = () => beerService.getBeerById('');
      await expect(beers).rejects.toThrow();
    });
  });

  describe('Random beer', () => {
    it('should get a random beer', async () => {
      const newBeer: CreateBeerDto = {
        name: 'Beer for random beer',
      };
      await beerService.createBeer(newBeer);
      const beers = beerService.getRandomBeer();
      await expect(beers).resolves.toHaveProperty('name');
    });
  });

  describe('Get beer from query', () => {
    it('should get that contains the query on name', async () => {
      const newBeer: CreateBeerDto = {
        name: 'Beer for querying the database',
      };
      const query = 'query';
      await beerService.createBeer(newBeer);
      const beer = (await beerService.searchBeer(query))[0];
      expect(beer).toHaveProperty('name', newBeer.name);
    });
  });

  describe('Update Beer', () => {
    it('should update the beer', async () => {
      const newBeer: CreateBeerDto = {
        name: 'Beer for the update',
      };

      const updateInfo: UpdateBeerDto = {
        name: 'updating the title',
        brewers_tips: ['Cool down your glass', 'pour tilted'],
        attenuation_level: 6.2,
        tagline: 'A delicious updating beer info',
      };
      const beerId = (await beerService.createBeer(newBeer))._id;
      const beers = beerService.updateBeerById(beerId, updateInfo);
      await expect(beers).resolves.toEqual(expect.objectContaining(updateInfo));
    });

    it(`should throw with invalid Id`, async () => {
      //@ts-expect-error
      const beers = () => beerService.updateBeerById('');
      await expect(beers).rejects.toThrow();
    });
  });

  describe('Delete Beer', () => {
    it('should update the beer', async () => {
      const newBeer: CreateBeerDto = {
        name: 'Beer for delete',
      };

      const beerId = (await beerService.createBeer(newBeer))._id;
      const beers = beerService.deleteBeerById(beerId);
      await expect(beers).resolves.toHaveProperty('name', newBeer.name);
    });

    it(`should throw with invalid Id`, async () => {
      //@ts-expect-error
      const beers = () => beerService.deleteBeerById('');
      await expect(beers).rejects.toThrow();
    });
  });
});
