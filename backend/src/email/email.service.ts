import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name); // Создаем логгер с именем сервиса

  constructor(private mailerService: MailerService) {}

  async sendTemplateEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>, // Объект с данными для шаблона
  ) {
    try {
      this.logger.log(
        `Sending template email to: ${to}, subject: ${subject}, template: ${template}`,
      );
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      this.logger.log(`Successfully sent template email to: ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send template email to: ${to}. Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async sendTicketEmail(
    to: string,
    eventName: string,
    tickets: {
      ticketId: string;
      qrCodeBase64: string;
      cid: string;
      qrBuffer: Buffer;
    }[],
  ) {
    const attachments = tickets.map((ticket) => ({
      filename: `${ticket.ticketId}.png`,
      content: ticket.qrBuffer,
      cid: ticket.cid,
    }));

    await this.mailerService.sendMail({
      to,
      subject: `Ваш билет на ${eventName}`,
      template: "./ticket",
      context: {
        eventName,
        tickets,
      },
      attachments,
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      this.logger.log(`Sending email to: ${to}, subject: ${subject}`);
      await this.mailerService.sendMail({
        to,
        subject,
        text,
        html,
      });
      this.logger.log(`Successfully sent email to: ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to: ${to}. Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
