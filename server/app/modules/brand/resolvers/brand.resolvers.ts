/** Dependencies **/
import { Mutation, Query, Resolver } from '@nestjs/graphql';

/** Services **/
import { BrandService } from '../services/brand.service';

/** Entities **/
import { Brand } from '../domain/brand/brand.entity';

/** View models **/
import { CreateBrandVM } from '../models/view/create-brand.vm';
import { UpdateBrandVM } from '../models/view/update-brand.vm';

@Resolver('Brand')
export class BrandResolvers {

  constructor(private readonly brandService: BrandService) {
  }

  @Query('allBrands')
  public async allBrands(source, args, context, info): Promise<Brand[]> {
    return await this.brandService.allBrands(source, args, context, info);
  }

  @Query('Brand')
  public async brand(source, args, context, info): Promise<Brand | never> {
    return await this.brandService.brand(source, args, context, info);
  }

  @Mutation('createBrand')
  public async createBrand(source, args, context, info): Promise<Brand | never> {
    const {name, website}: CreateBrandVM = args;

    return await this.brandService.createBrand({
      name: name,
      website: website,
    });
  }

  @Mutation('updateBrand')
  public async updateBrand(source, args, context, info): Promise<Brand | never> {
    const {id: brandId} = args;
    const {name, website}: UpdateBrandVM = args;

    return await this.brandService.updateBrand(brandId, {
      name: name,
      website: website,
    });
  }

  @Mutation('deleteBrand')
  public async deleteBrand(source, args, context, info): Promise<Brand | never> {
    const {id: brandId} = args;

    return await this.brandService.deleteBrand(brandId);
  }

}
