import { Injectable, NestMiddleware } from '@nestjs/common';
import { XHubSignatureService } from './xhub-signature.service';

@Injectable()
export class XHubSignatureMiddleware implements NestMiddleware {
  constructor(private readonly XHubSignatureService: XHubSignatureService) {}

  use(req: any, res: any, next: () => void) {
    const verify = this.XHubSignatureService.handleWebhook(
      req.body,
      req.headers['x-hub-signature-256'] ?? '',
    );

    if (!verify) {
      return res.status(401).json({
        response: false,
        statusCode: 401,
        message: 'https://vk.com/sticker/1-55330-512b',
      });
    }

    next();
  }
}
