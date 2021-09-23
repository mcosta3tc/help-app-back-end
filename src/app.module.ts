import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigurationService } from './database/databaseConfiguration.service';

@Module({
  imports: [
    TagModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
        PORT: Joi.number().required(),
        ENTITIES_LOCATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigurationService,
      inject: [DatabaseConfigurationService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
