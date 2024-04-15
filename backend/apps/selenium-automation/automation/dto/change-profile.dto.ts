import { ProfileStudentTypeEnum } from 'apps/selenium-automation/common/enums/stydent-type.enum';
import { RtomLoginDto } from './rtom-login.dto';

export class ChangeProfileDto extends RtomLoginDto {
  studentType: ProfileStudentTypeEnum;
}
