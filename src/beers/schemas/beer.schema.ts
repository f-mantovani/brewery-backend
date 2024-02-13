import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BeerDocument = HydratedDocument<Beer>;

@Schema()
export class Beer {
  @Prop()
  image_url: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  tagline: string;

  @Prop()
  description: string;

  @Prop()
  first_brewed: string;

  @Prop([String])
  brewers_tips: string[];

  @Prop()
  attenuation_level: number;

  @Prop()
  contributed_by: string;
}

export const BeerSchema = SchemaFactory.createForClass(Beer);
