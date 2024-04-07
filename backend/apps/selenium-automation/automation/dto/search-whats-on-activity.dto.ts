import { Matches } from 'class-validator';

export class SearchWhatsOnActivityDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "The data format should be 'yyyy-MM-dd'",
  })
  fromDate: string;
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "The data format should be 'yyyy-MM-dd'",
  })
  toDate: string;
}
