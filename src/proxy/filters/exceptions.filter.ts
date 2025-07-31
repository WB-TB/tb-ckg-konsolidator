import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { BackendServiceException, ErrorCode, ErrorResponse } from '../exceptions/backend.exception'; // Impor base exception
  // Tidak perlu mengimpor SatusehatApiException atau InternalServiceException secara langsung
  // jika hanya BackendServiceException yang akan ditangani untuk properti kustom
  
  @Catch() // Tangkap semua jenis exception
  export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const errorResponse: ErrorResponse = {
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorNumber: ErrorCode.UNKNOWN,
        errorName: 'UNKNOWN',
        message: 'Internal server error',
        errors: undefined,
        stack: undefined,
      };
  
      // let status = HttpStatus.INTERNAL_SERVER_ERROR;
      // let message = 'Internal server error';
      // let errorName = 'InternalServerError';
      // let errorCode: number | undefined; // Tambahkan errorCode
      let originalDetails: any;
      let exceptionStack: any;

  
      // Tangani BackendServiceException (termasuk SatusehatApiException dan InternalServiceException)
      if (exception instanceof BackendServiceException) {
        const exceptionResponse = exception.getResponse() as any;
        errorResponse.httpCode = exception.getStatus();
        errorResponse.errorNumber = exceptionResponse.errorCode || errorResponse.errorNumber;
        errorResponse.errorName = ErrorCode[exceptionResponse.errorCode] || errorResponse.errorName;
        errorResponse.message = exceptionResponse.message;

        exceptionStack = exception.stack;
        originalDetails = exceptionResponse.originalError;
  
        this.logger.warn(
          `[${exceptionResponse.error}] Path: ${request.url}, Status: ${errorResponse.httpCode}, Code: ${errorResponse.errorNumber}[${errorResponse.errorName}}], Message: ${errorResponse.message}, Original: ${JSON.stringify(errorResponse.errors || {})}`,
          exception.stack,
        );
      }
      // Tangani HttpException standar NestJS yang BUKAN BackendServiceException
      else if (exception instanceof HttpException) {
        errorResponse.httpCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        if (typeof exceptionResponse === 'string') {
          errorResponse.message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
          errorResponse.message = (exceptionResponse as any).message || errorResponse.message;
          if ((exceptionResponse as any).error)
            errorResponse.message = (exceptionResponse as any).error;
          if ((exceptionResponse as any).message)
            errorResponse.message += ': ' + (exceptionResponse as any).message;
        }

        exceptionStack = exception.stack;

        this.logger.warn(
          `[HttpError] Path: ${request.url}, Status: ${errorResponse.httpCode}, Message: ${errorResponse.message}`,
          exception.stack,
        );
      }
      // Tangani error lainnya yang tidak dikenal
      else {
        this.logger.warn(
          `[UnhandledError] Path: ${request.url}, Message: ${(exception as Error).message || errorResponse.message}, Exception: ${exception}`,
          (exception as Error).stack,
        );
      }
  
      if (process.env.NODE_ENV === 'development') {
        if (originalDetails) {
          errorResponse.errors = originalDetails;
        }
        if (exceptionStack) {
          errorResponse.stack = exceptionStack;
        }
      }
  
      response.status(errorResponse.httpCode).json(errorResponse);
    }
  }