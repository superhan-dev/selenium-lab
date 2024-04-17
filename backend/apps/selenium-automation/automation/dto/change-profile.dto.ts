import { ProfileStudentTypeEnum } from 'apps/selenium-automation/common/enums/stydent-type.enum';
import { RtomLoginDto } from './rtom-login.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeProfileDto extends RtomLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ProfileStudentTypeEnum)
  studentType: ProfileStudentTypeEnum;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  studentNumber: string;
}
