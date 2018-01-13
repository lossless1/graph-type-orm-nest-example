/** Express **/
import './polyfills';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';

/** Modules **/
import { AppModule } from './app/app.module';

/** Server bootstrap **/
(async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(AppModule, server);

  app.use(bodyParser.json());

  await app.listen(Number(process.env.PORT));
})();
