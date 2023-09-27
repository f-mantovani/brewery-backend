import { CreateBeerDto, UpdateBeerDto } from '../../src/beers/dto';

export const BeerDTO = (): CreateBeerDto => {
  return {
    name: 'Stub testing name',
    attenuation_level: 1.95,
    brewers_tips: ['Cool down your glass', 'pour tilted'],
    contributed_by: 'Felipe',
    description: 'This is the description line',
    first_brewed: '2023',
    tagline: 'A delicious updating beer info',
    image: '',
  };
};

export const UpdateBeerDTO = (): UpdateBeerDto => {
  return {
    name: 'updating the title',
    brewers_tips: ['Cool down your glass', 'pour tilted'],
    attenuation_level: 6.2,
    tagline: 'A delicious updating beer info',
  };
};
