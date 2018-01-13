/** Dependencies **/
import * as path from 'path';
import { CustomValue } from '@nestjs/core/injector/module';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const DatabaseConfig: CustomValue = {
  name: 'DatabaseConfig',
  provide: 'DatabaseConfig',
  useValue: <PostgresConnectionOptions[]> [
    {
      name: 'default',

      type: process.env.DATABASE_TYPE,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT),

      logging: process.env.ENVIRONMENT === 'dev',
      cli: {
        migrationsDir: path.join(__dirname, '../database/migrations'),
      },
      entities: [
        path.join(__dirname, '../app/**/*.entity.ts'),
        path.join(__dirname, '../app/**/*.entity.js'),
      ],
      entitySchemas: [
        path.join(__dirname, '../app/**/*.schema.ts'),
        path.join(__dirname, '../app/**/*.schema.js'),
      ],
      migrations: [
        path.join(__dirname, '../app/**/*.migration.ts'),
        path.join(__dirname, '../app/**/*.migration.js'),
      ],
      subscribers: [
        path.join(__dirname, '../app/**/*.subscriber.ts'),
        path.join(__dirname, '../app/**/*.subscriber.js'),
      ],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    },
  ],
};

export type DatabaseConfig = PostgresConnectionOptions[];
