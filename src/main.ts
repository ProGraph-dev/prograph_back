import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import { config } from 'dotenv';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as cookieParser from 'cookie-parser';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'my-secret',
    parseOptions: {},
  });

  await app.register(fastifyCors, {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
