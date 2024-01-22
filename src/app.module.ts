import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { XHubSignatureMiddleware } from './middleware/xhub-signature/xhub-signature.middleware';
import { XHubSignatureModule } from './middleware/xhub-signature/xhub-signature.module';

@Module({
  imports: [ConfigModule.forRoot(), XHubSignatureModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XHubSignatureMiddleware).forRoutes('*');
  }
}
