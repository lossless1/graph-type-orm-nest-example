/** Dependencies **/
import { HttpException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

/** Providers **/
import { DatabaseProvider } from '../../../database/providers/database.provider';

/** Exceptions **/
import { InternalServerErrorException } from '../../../../common/exceptions/internal-server-error.exception';

/** Commands **/
import { CreateBrandCommand } from '../create-brand.command';

/** Entities **/
import { Brand } from '../../domain/brand/brand.entity';

/** Repositories **/
import { BrandRepository } from '../../repositories/brand.repository';

@CommandHandler(CreateBrandCommand)
export class CreateBrandHandler implements ICommandHandler<CreateBrandCommand> {

  constructor(private readonly eventPublisher: EventPublisher,
              private readonly databaseProvider: DatabaseProvider,
              @Inject('BrandRepository') private readonly brandRepository: BrandRepository) {
  }

  public async execute(createBrandCommand: CreateBrandCommand, resolve: (value: Brand | HttpException) => void): Promise<any> {
    const {createBrandVM: {name, website}} = createBrandCommand;

    /** Create an brand entity **/
    let brand: Brand = this.eventPublisher.mergeObjectContext(new Brand());

    /** Calling create brand method **/
    brand.createBrand({
      name: name,
      website: website,
    });

    /** Transaction **/
    const queryRunner = await this.databaseProvider.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      brand = await queryRunner.manager.save(brand);

      await queryRunner.commitTransaction();
    } catch (exception) {
      await queryRunner.rollbackTransaction();

      return resolve(new InternalServerErrorException());
    }

    /** Commit **/
    brand.commit();

    /** Resolve **/
    return resolve(brand);
  }

}
