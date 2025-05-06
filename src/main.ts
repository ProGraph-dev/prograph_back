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
import * as path from 'path';
import fastifyStatic from '@fastify/static';
import { AllExceptionsFilter } from './utils/exceptions/all-exceptions.filter';

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

  app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
    decorateReply: false,
  });

  app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'src', 'utils', 'lang'),
    prefix: '/lang/',
    decorateReply: false,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(cookieParser());

  await app.listen(process.env.PORT, '0.0.0.0');
}

bootstrap();
