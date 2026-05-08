import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import twilio, { Twilio } from 'twilio';

interface SendCodeResult {
  status: 'pending' | 'mock';
  to: string;
  channel: 'sms';
}

interface VerifyCodeResult {
  approved: boolean;
  verificationToken?: string;
}

/**
 * Wraps Twilio Verify v2.
 * If TWILIO_* envs are missing, falls back to a deterministic MOCK code (123456)
 * so the dev environment keeps working without paid SMS.
 */
@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private client: Twilio | null = null;
  private serviceSid: string | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    const sid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const token = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const verifySid = this.config.get<string>('TWILIO_VERIFY_SERVICE_SID');

    if (sid && token && verifySid) {
      this.client = twilio(sid, token);
      this.serviceSid = verifySid;
      this.logger.log('Twilio Verify configurado.');
    } else {
      this.logger.warn(
        'Twilio Verify NÃO configurado — usando modo mock (código fixo 123456). ' +
          'Defina TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_VERIFY_SERVICE_SID em backend/.env.',
      );
    }
  }

  private normalize(phone: string): string {
    const digits = phone.replace(/[^\d+]/g, '');
    if (!digits.startsWith('+')) {
      throw new BadRequestException(
        'O telefone deve estar em formato internacional E.164, ex.: +5511999999999',
      );
    }
    if (digits.length < 8 || digits.length > 16) {
      throw new BadRequestException('Número de telefone inválido.');
    }
    return digits;
  }

  async sendCode(rawPhone: string): Promise<SendCodeResult> {
    const phone = this.normalize(rawPhone);

    if (!this.client || !this.serviceSid) {
      this.logger.debug(`[MOCK] Código 123456 "enviado" para ${phone}`);
      return { status: 'mock', to: phone, channel: 'sms' };
    }

    try {
      const verification = await this.client.verify.v2
        .services(this.serviceSid)
        .verifications.create({ to: phone, channel: 'sms' });

      return { status: verification.status as 'pending', to: phone, channel: 'sms' };
    } catch (err: any) {
      this.logger.error(`Falha ao enviar SMS: ${err?.message ?? err}`);
      throw new ServiceUnavailableException(
        'Não foi possível enviar o SMS. Verifique o número e tente novamente.',
      );
    }
  }

  async verifyCode(rawPhone: string, code: string): Promise<VerifyCodeResult> {
    const phone = this.normalize(rawPhone);
    if (!/^\d{4,8}$/.test(code)) {
      throw new BadRequestException('Código inválido.');
    }

    let approved = false;

    if (!this.client || !this.serviceSid) {
      approved = code === '123456';
    } else {
      try {
        const check = await this.client.verify.v2
          .services(this.serviceSid)
          .verificationChecks.create({ to: phone, code });
        approved = check.status === 'approved';
      } catch (err: any) {
        this.logger.warn(`Falha na verificação Twilio: ${err?.message ?? err}`);
        approved = false;
      }
    }

    if (!approved) return { approved: false };

    // short-lived token proving "this phone is verified"
    const verificationToken = this.jwt.sign(
      { phone, scope: 'phone_verified' },
      { expiresIn: '15m' },
    );

    return { approved: true, verificationToken };
  }

  /** Validates a token issued by verifyCode — used at register time. */
  assertVerifiedToken(token: string, expectedPhone: string): void {
    const phone = this.normalize(expectedPhone);
    let payload: any;
    try {
      payload = this.jwt.verify(token);
    } catch {
      throw new BadRequestException('Token de verificação inválido ou expirado.');
    }
    if (payload?.scope !== 'phone_verified' || payload?.phone !== phone) {
      throw new BadRequestException('Token não corresponde ao telefone informado.');
    }
  }
}
