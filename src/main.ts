import * as fs from 'fs';
import * as helmet from 'helmet';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import configuration, { Config, ServerConfig } from './config/configuration';

async function bootstrap() {
  const whitelist = [configuration().server.url];
  const corsOptions = {
    origin: (origin: any, callback?: any) => {
      if (!origin) return callback(null, true);

      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };

  const keyFile = fs.readFileSync(join(process.cwd(), 'ssl/localhost-key.pem'));
  const certFile = fs.readFileSync(join(process.cwd(), 'ssl/localhost.pem'));

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
    // httpsOptions: {
    //   key: keyFile,
    //   cert: certFile,
    // },
  });
  const configService: ConfigService<Config> = app.get(ConfigService);

  app.setGlobalPrefix('api/v1.0');
  app.use('/api/*', helmet());
  app.set('trust proxy', 1);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get<ServerConfig>('server').port);
  Logger.verbose(
    `API Server Started running on ${
      configService.get<ServerConfig>('server').url
    }/api/v1.0`,
  );
  Logger.verbose(
    `GraphQL Server Started running on ${
      configService.get<ServerConfig>('server').url
    }/graphql/v1.0`,
  );
}
bootstrap();
