import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from '../proxy/proxy.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthJsonInterceptor } from '../proxy/proxy.interceptor';
import { AllExceptionsFilter } from '../proxy/filters/exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Membuat ConfigService tersedia di seluruh aplikasi
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [
    // Daftarkan AuthJsonInterceptor secara global
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthJsonInterceptor,
    },
    // Daftarkan Exception Filter secara global
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}