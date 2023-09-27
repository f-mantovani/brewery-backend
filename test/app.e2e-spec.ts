import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { BeerDTO, UpdateBeerDTO } from './stubs';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const baseUrl = 'http://localhost:3333/beers';
  let connection: Connection;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    connection = app.get(getConnectionToken());
    pactum.request.setBaseUrl(baseUrl);
  });

  afterAll(async () => {
    await connection.db.dropDatabase();
    await connection.close();
    app.close();
  });

  describe('Get empty beer list', () => {
    it('should get an empty array', () => {
      return pactum.spec().get('/').expectStatus(200).expectBody([]);
    });
  });

  describe('Create beer', () => {
    it('should create a new beer', () => {
      const dto = BeerDTO();
      return pactum
        .spec()
        .post('/new')
        .withBody(dto)
        .expectStatus(201)
        .expectBodyContains(dto.name)
        .stores('beerId', '_id');
    });
  });

  describe('Get beers', () => {
    describe('Get beers array', () => {
      it('should get an array of beers', () => {
        return pactum.spec().get('/').expectStatus(200).expectJsonLength(1);
      });
    });

    describe('Get beer by id', () => {
      it('should get beer by id', () => {
        const beer = BeerDTO();
        return pactum
          .spec()
          .get('/{id}')
          .withPathParams('id', '$S{beerId}')
          .expectStatus(200)
          .expectBodyContains(beer.name);
      });
    });

    describe('Get beers', () => {
      it('Should get a random beer', () => {
        const beer = BeerDTO();
        return pactum
          .spec()
          .get('/random')
          .expectStatus(200)
          .expectBodyContains(beer.name)
          .inspect();
      });
    });
  });

  describe('Search beer', () => {
    it(`should search a beer by it's name`, () => {
      const beer = BeerDTO();
      const beerName = beer.name.slice(0, 5);
      return pactum
        .spec()
        .get('/')
        .withQueryParams('q', beerName)
        .expectStatus(200)
        .expectBodyContains(beer.name)
        .expectBodyContains(beer.attenuation_level);
    });
  });

  describe('Update beer', () => {
    it('should update a beer by id', () => {
      const beerUpdate = UpdateBeerDTO();
      return pactum
        .spec()
        .put('/{id}')
        .withPathParams('id', '$S{beerId}')
        .withBody({ ...beerUpdate })
        .expectStatus(200)
        .expectBodyContains(beerUpdate.name);
    });
  });

  describe('Delete beer', () => {
    it('should delete a beer by id', () => {
      return pactum
        .spec()
        .delete('/{id}')
        .withPathParams('id', '$S{beerId}')
        .expectStatus(204);
    });
  });

  describe('Get empty beer list', () => {
    it('should get an empty array', () => {
      return pactum.spec().get('/').expectStatus(200).expectBody([]);
    });
  });
});
