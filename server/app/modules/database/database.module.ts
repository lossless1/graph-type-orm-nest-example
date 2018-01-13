/** Dependencies **/
import 'reflect-metadata';
import { Module, OnModuleDestroy } from '@nestjs/common';

/** Config **/
import { DatabaseConfig } from '../../../config/database.config';

const config = [
  DatabaseConfig,
];

/** Providers **/
import { DatabaseProvider } from './providers/database.provider';

const providers = [
  DatabaseProvider,
];

@Module({
  imports: [],
  controllers: [],
  components: [
    ...providers,
    ...config,
  ],
  exports: [
    ...providers,
  ],
})
export class DatabaseModule implements OnModuleDestroy {

  constructor(private readonly databaseProvider: DatabaseProvider) {
  }

  public async onModuleDestroy(): Promise<void> {
    await this.databaseProvider.closeConnections();
  }

}
