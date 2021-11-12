import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import configuration, {
  Config,
  MongoConfig,
  RedisConfig,
} from './config/configuration';
import { AccountModule } from './account/account.module';
import { UploadModule } from './upload/upload.module';
import { CodeModule } from './code/code.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<Config>) => ({
        uri: `mongodb://${configService.get<MongoConfig>('mongo').url}/${
          configService.get<MongoConfig>('mongo').name
        }`,
        connectionFactory: (connection) => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      useFactory: () => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          debug: true,
          playground: true,
          path: 'graphql/v1.0',
          installSubscriptionHandlers: true,
          subscriptions: {
            path: '/graphql/v1.0/subscription',
            'graphql-ws': true,
          },
          introspection: true,
        };
      },
    }),
    // MailerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService<Config>) => ({
    //     ...configService.get<MailConfig>('mail'),
    //     // template: {
    //     //   dir: join(process.cwd(), 'templates'),
    //     //   adapter: new HandlebarsAdapter({
    //     //     nl2br: (value) => {
    //     //       const nl2br = value.replace(
    //     //         /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    //     //         '$1' + '<br>' + '$2',
    //     //       );
    //     //       return new Handlebars.SafeString(nl2br);
    //     //     },
    //     //   }),
    //     //   options: {
    //     //     strict: true,
    //     //   },
    //     // },
    //   }),
    //   inject: [ConfigService],
    // }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<Config>) => ({
        redis: { ...configService.get<RedisConfig>('redis') },
      }),
      inject: [ConfigService],
    }),
    AccountModule,
    UploadModule,
    CodeModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
