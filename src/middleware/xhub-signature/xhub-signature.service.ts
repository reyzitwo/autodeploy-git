import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class XHubSignatureService {
  handleWebhook(payload: any, signature: string): boolean {
    try {
      // Validate the payload using the secret token
      return this.validatePayload(payload, signature);
    } catch (e) {
      return false;
    }
  }

  private validatePayload(payload: any, signature: string): boolean {
    const expectedSignature =
      'sha256=' +
      createHmac('sha256', process.env.SECRET_KEY_GITHUB)
        .update(JSON.stringify(payload))
        .digest('hex');

    // Use secure comparison to mitigate timing attacks
    return timingSafeEqual(
      Buffer.from(expectedSignature, 'ascii'),
      Buffer.from(signature, 'ascii'),
    );
  }
}
