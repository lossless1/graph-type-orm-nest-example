/** Dependencies **/
import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {

  constructor(response: string | object = 'Internal server error', status: number = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(response, status);
  }

}
