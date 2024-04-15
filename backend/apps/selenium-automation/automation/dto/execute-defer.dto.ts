import { Matches } from 'class-validator';
import { RtomLoginDto } from './rtom-login.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteDeferDto extends RtomLoginDto {
  @Matches(/^\d{9}$/)
  @ApiProperty()
  studentNumber: number;
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "The data format should be 'dd/MM/yyyy'",
  })
  @ApiProperty()
  fromDate: string;
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "The data format should be 'dd/MM/yyyy'",
  })
  @ApiProperty()
  toDate: string;
}
