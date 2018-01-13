/** Dependencies **/
import { ICommand } from '@nestjs/cqrs';

/** View models **/
import { CreateBrandVM } from '../models/view/create-brand.vm';

export class CreateBrandCommand implements ICommand {
  public createBrandVM: CreateBrandVM;
}
