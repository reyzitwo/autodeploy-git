import { Module } from '@nestjs/common';
import { XHubSignatureService } from './xhub-signature.service';

@Module({
  providers: [XHubSignatureService],
  exports: [XHubSignatureService],
})
export class XHubSignatureModule {}
