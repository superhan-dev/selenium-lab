import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailSenderService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(dto: SendEmailDto) {
    const from = 'superhan.dev@gmail.com';
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_STMP_HOST'),
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_APP_PASSWORD'),
      },
    });

    // TODO: file attatchments test.
    await transporter.sendMail({
      from: from,
      to: dto.to,
      subject: dto.subject,
      text: dto.text,
      attachments: dto.attatchments,
    });
  }
}
