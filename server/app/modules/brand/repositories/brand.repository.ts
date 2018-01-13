/** Dependencies **/
import { Repository } from 'typeorm';
import { CustomFactory } from '@nestjs/core/injector/module';

/** Providers **/
import { DatabaseProvider } from '../../database/providers/database.provider';

/** Entities **/
import { Brand } from '../domain/brand/brand.entity';

export const BrandRepository: CustomFactory = {
  name: 'BrandRepository',
  provide: 'BrandRepository',
  useFactory: async (databaseProvider: DatabaseProvider): Promise<Repository<Brand>> => {
    return await databaseProvider.getRepository(Brand);
  },
  inject: [DatabaseProvider],
};

export type BrandRepository = Repository<Brand>;
