import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
    UnauthorizedException,
    Logger,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class AuthJsonInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuthJsonInterceptor.name);
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const path = request.url;
  
      // Lewati validasi untuk /heartbeat dan /oauth2/v1/accesstoken
      if (path.includes('/')) {
        return next.handle();
      }
  
      this.logger.debug(`Applying AuthJsonInterceptor for path: ${path}`);
  
      // Validasi Header Authorization
      const authorizationHeader = request.headers['authorization'];
      if (!authorizationHeader) {
        this.logger.warn(`Authorization header missing for path: ${path}`);
        throw new UnauthorizedException('Authorization header is required.');
      }

      // Validasi token lebih lanjut di sini
      if (!authorizationHeader.startsWith('Bearer ')) {
        this.logger.warn(`Invalid Authorization header format for path: ${path}`);
        throw new UnauthorizedException('Authorization header must be in Bearer token format.');
      }
  
  
      // Validasi Header Content-Type
      const contentType = request.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        this.logger.warn(`Invalid Content-Type for path: ${path}: ${contentType}`);
        throw new BadRequestException('Content-Type must be application/json.');
      }
  
      return next.handle();
    }
  }