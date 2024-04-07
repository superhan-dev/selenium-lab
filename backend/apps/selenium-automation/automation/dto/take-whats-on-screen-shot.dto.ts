import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, Matches } from 'class-validator';

export class TakeWhatsOnScreenShotDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => String)
  @Matches(/^https:\/\//, {
    each: true,
    message: 'The Protocol is not secure.',
  })
  @Matches(/whatson\.melbourne\.vic\.gov\.au/, {
    each: true,
    message: 'The URL is wrong',
  })
  urls: string[];
}
