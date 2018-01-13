/** Dependencies **/
import { HttpException, HttpStatus } from '@nestjs/common';

export class BrandNotFoundException extends HttpException {

  constructor(response: string | object = 'Brand not found', status: number = HttpStatus.NOT_FOUND) {
    super(response, status);
  }

}
