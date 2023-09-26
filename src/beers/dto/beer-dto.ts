import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBeerDto {
  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  first_brewed?: string;

  @IsOptional()
  @IsArray()
  brewers_tips?: string[];

  @IsOptional()
  @IsNumber()
  attenuation_level?: number;

  @IsOptional()
  @IsString()
  contributed_by?: string;
}

export class UpdateBeerDto extends PartialType(CreateBeerDto) {}
