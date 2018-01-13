/** Dependencies **/
import { HttpException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

/** Providers **/
import { DatabaseProvider } from '../../../database/providers/database.provider';

/** Exceptions **/
import { BrandNotFoundException } from '../../exceptions/brand-not-found.exception';
import { InternalServerErrorException } from '../../../../common/exceptions/internal-server-error.exception';

/** Commands **/
import { UpdateBrandCommand } from '../update-brand.command';

/** Entities **/
import { Brand } from '../../domain/brand/brand.entity';

/** Repositories **/
import { BrandRepository } from '../../repositories/brand.repository';

@CommandHandler(UpdateBrandCommand)
export class UpdateBrandHandler implements ICommandHandler<UpdateBrandCommand> {

  constructor(private readonly eventPublisher: EventPublisher,
              private readonly databaseProvider: DatabaseProvider,
              @Inject('BrandRepository') private readonly brandRepository: BrandRepository) {
  }

  public async execute(updateBrandCommand: UpdateBrandCommand, resolve: (value: Brand | HttpException) => void): Promise<any> {
    const {brandId, updateBrandVM: {name, website}} = updateBrandCommand;

    /** Checking the existence of brand **/
    let brand: Brand = await this.brandRepository.findOneById(brandId);

    if (!brand) {
      return resolve(new BrandNotFoundException());
    }

    brand = this.eventPublisher.mergeObjectContext(brand);

    /** Calling update brand method **/
    brand.updateBrand({
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
