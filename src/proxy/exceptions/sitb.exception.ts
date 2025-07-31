import { HttpStatus } from '@nestjs/common';
import { BackendServiceException } from './backend.exception'; // Impor base exception

export class SitbException extends BackendServiceException {
  constructor(message: string, errorCode: number, httpCode: HttpStatus = HttpStatus.BAD_GATEWAY, originalError?: any) {
    super(message, errorCode, httpCode, originalError);
    (this.getResponse() as any).error = 'SitbError';
  }
}