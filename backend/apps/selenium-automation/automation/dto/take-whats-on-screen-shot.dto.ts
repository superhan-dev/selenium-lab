import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, Matches } from 'class-validator';
import { RtomLoginDto } from './rtom-login.dto';

export class TakeWhatsOnScreenShotDto extends RtomLoginDto {
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
  @ApiProperty()
  urls: string[];
}
