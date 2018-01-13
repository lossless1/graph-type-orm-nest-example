/** Dependencies **/
import { ICommand } from '@nestjs/cqrs';

/** View models **/
import { UpdateBrandVM } from '../models/view/update-brand.vm';

export class UpdateBrandCommand implements ICommand {
  public brandId: number;
  public updateBrandVM: UpdateBrandVM;
}
