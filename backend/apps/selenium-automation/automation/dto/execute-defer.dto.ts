import { Matches } from 'class-validator';

export class ExecuteDeferDto {
  @Matches(/^\d{9}$/)
  studentNumber: number;
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "The data format should be 'dd/MM/yyyy'",
  })
  fromDate: string;
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "The data format should be 'dd/MM/yyyy'",
  })
  toDate: string;
}
