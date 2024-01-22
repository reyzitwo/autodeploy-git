import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { exec } from 'child_process';

@Controller('/deploy')
export class AppController {
  @Post()
  post(@Body() body: { repository: { name: string; full_name: string } }) {
    const { name, full_name } = body.repository;

    return new Promise((res) => {
      exec(
        `bash ${__dirname}/scripts/deploy.sh ${name} ${full_name}`,
        (error) => {
          if (error) {
            throw new HttpException(
              'Deploy failed, check logs :(',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }

          return res({
            statusCode: 200,
            response: true,
            message: 'Deploy successful! :)',
          });
        },
      );
    });
  }
}
