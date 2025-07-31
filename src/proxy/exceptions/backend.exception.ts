import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  SATUSEHAT = 1099,
  SITB = 2097,
  CKG = 2096,
  UNKNOWN = 3000,
};

export interface ErrorResponse {
  httpCode: number,
  errorNumber: number,
  errorName: string,
  message: string,
  errors?: any,
  stack?: any
};

export abstract class BackendServiceException extends HttpException {
  constructor(
    message: string,
    errorCode: number,
    statusCode: HttpStatus = HttpStatus.BAD_GATEWAY,
    originalError?: any,
  ) {
    super({
      statusCode,
      message,
      errorCode,
      error: 'BackendServiceError',
      originalError: originalError ? (originalError.response?.data || originalError.message) : undefined,
    }, statusCode);
  }
}