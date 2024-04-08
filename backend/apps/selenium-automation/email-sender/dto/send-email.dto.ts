export class SendEmailDto {
  to: string;
  subject: string;
  text: string;
  // TODO:define as types.
  attatchments: { filename: string; content: Buffer };
}
