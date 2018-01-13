/** Dependencies **/
import { ICommand } from '@nestjs/cqrs';

export class DeleteBrandCommand implements ICommand {
  public brandId: number;
}
