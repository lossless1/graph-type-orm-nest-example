/** Dependencies **/
import { HttpException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

/** Providers **/
import { DatabaseProvider } from '../../../database/providers/database.provider';

/** Exceptions **/
import { BrandNotFoundException } from '../../exceptions/brand-not-found.exception';
import { InternalServerErrorException } from '../../../../common/exceptions/internal-server-error.exception';

/** Commands **/
import { DeleteBrandCommand } from '../delete-brand.command';

/** Entities **/
import { Brand } from '../../domain/brand/brand.entity';

/** Repositories **/
import { BrandRepository } from '../../repositories/brand.repository';

@CommandHandler(DeleteBrandCommand)
export class DeleteBrandHandler implements ICommandHandler<DeleteBrandCommand> {

  constructor(private readonly eventPublisher: EventPublisher,
              private readonly databaseProvider: DatabaseProvider,
              @Inject('BrandRepository') private readonly brandRepository: BrandRepository) {
  }

  public async execute(deleteBrandCommand: DeleteBrandCommand, resolve: (value: Brand | HttpException) => void): Promise<any> {
    const {brandId} = deleteBrandCommand;

    /** Checking the existence of brand **/
    let brand: Brand = await this.brandRepository.findOneById(brandId);

    if (!brand) {
      return resolve(new BrandNotFoundException());
    }

    brand = this.eventPublisher.mergeObjectContext(brand);

    /** Transaction **/
    const queryRunner = await this.databaseProvider.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      brand = await queryRunner.manager.remove(brand);

      await queryRunner.commitTransaction();
    } catch (exception) {
      await queryRunner.rollbackTransaction();

      return resolve(new InternalServerErrorException());
    }

    /** Commit **/
    brand.commit();

    /** Resolve **/
    return resolve(<Brand>{
      ...brand,
      id: brandId,
    });
  }

}
