/** Dependencies **/
import { CommandBus } from '@nestjs/cqrs';
import { findOne, findMany } from 'graph-type-orm';
import { Component, HttpException, Inject } from '@nestjs/common';

/** Exceptions **/
import { BrandNotFoundException } from '../exceptions/brand-not-found.exception';

/** Commands **/
import { CreateBrandCommand } from '../commands/create-brand.command';
import { UpdateBrandCommand } from '../commands/update-brand.command';
import { DeleteBrandCommand } from '../commands/delete-brand.command';

/** Entities **/
import { Brand } from '../domain/brand/brand.entity';

/** Repositories **/
import { BrandRepository } from '../repositories/brand.repository';

/** View models **/
import { CreateBrandVM } from '../models/view/create-brand.vm';
import { UpdateBrandVM } from '../models/view/update-brand.vm';

@Component()
export class BrandService {

  constructor(private readonly commandBus: CommandBus,
              @Inject('BrandRepository') private readonly brandRepository: BrandRepository) {
  }

  /**
   * Method to fetch brands.
   *
   * @param source
   * @param args
   * @param context
   * @param info
   * @returns {Promise<Brand[]>}
   */
  public async allBrands(source, args, context, info): Promise<Brand[]> {
    return await findMany<Brand>(this.brandRepository)(source, args, context, info);
  }

  /**
   * Method to fetch brand.
   *
   * @param source
   * @param args
   * @param context
   * @param info
   * @returns {Promise<Brand>}
   */
  public async brand(source, args, context, info): Promise<Brand | never> {
    const brand: Brand = await findOne<Brand>(this.brandRepository)(source, args, context, info);

    if (!brand) {
      throw new BrandNotFoundException();
    }

    return brand;
  }

  /**
   * Method to create brand.
   *
   * @param {CreateBrandVM} createBrandVM
   * @returns {Promise<Brand>}
   */
  public async createBrand(createBrandVM: CreateBrandVM): Promise<Brand | never> {
    const createBrandCommand: CreateBrandCommand = new CreateBrandCommand();

    createBrandCommand.createBrandVM = createBrandVM;

    const commandResult: Brand | HttpException = await this.commandBus.execute<CreateBrandCommand>(createBrandCommand);

    if (commandResult instanceof HttpException) {
      throw commandResult;
    }

    return commandResult;
  }

  /**
   * Method to update brand.
   *
   * @param {number} brandId
   * @param {UpdateBrandVM} updateBrandVM
   * @returns {Promise<Brand>}
   */
  public async updateBrand(brandId: number, updateBrandVM: UpdateBrandVM): Promise<Brand | never> {
    const updateBrandCommand: UpdateBrandCommand = new UpdateBrandCommand();

    updateBrandCommand.brandId = brandId;
    updateBrandCommand.updateBrandVM = updateBrandVM;

    const commandResult: Brand | HttpException = await this.commandBus.execute<UpdateBrandCommand>(updateBrandCommand);

    if (commandResult instanceof HttpException) {
      throw commandResult;
    }

    return commandResult;
  }

  /**
   * Method to delete brand.
   *
   * @param {number} brandId
   * @returns {Promise<Brand>}
   */
  public async deleteBrand(brandId: number): Promise<Brand | never> {
    const deleteBrandCommand: DeleteBrandCommand = new DeleteBrandCommand();

    deleteBrandCommand.brandId = brandId;

    const commandResult: Brand | HttpException = await this.commandBus.execute<DeleteBrandCommand>(deleteBrandCommand);

    if (commandResult instanceof HttpException) {
      throw commandResult;
    }

    return commandResult;
  }

}
