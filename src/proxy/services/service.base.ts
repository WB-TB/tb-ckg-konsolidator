import { Request, Response } from 'express';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ProxyTransaction } from "../utils/types";
import { catchError, lastValueFrom } from 'rxjs';
import { SatusehatApiException } from '../exceptions/satusehat.exception';
import { SitbException } from '../exceptions/sitb.exception';
import { ErrorCode } from '../exceptions/backend.exception';
import { AsikCkgException } from '../exceptions/ckg.exception';
import { HttpStatus, Logger } from '@nestjs/common';
import { ProxyService } from '../proxy.service';

export abstract class BaseProxyService {
  protected transaction: ProxyTransaction;

  constructor(
    protected readonly proxyService: ProxyService,
    protected readonly envPrefix: string,
    protected readonly baseUrl: string,
    protected readonly targetUrl: string,
    protected readonly req: Request,
    protected readonly res: Response,
    protected readonly logger: Logger,
  ) {
    
  }

  setTransaction(transaction: ProxyTransaction) {
    this.transaction = transaction;
  }

  async sendRequest(): Promise<any> {
    const config: AxiosRequestConfig = {
      method: this.req.method as AxiosRequestConfig['method'],
      url: this.targetUrl,
      headers: { 
        ...this.req.headers,
        'X-Request-ID': this.transaction.transactionId,
      },
      data: this.req.body,
      params: this.req.query,
      // Penting: Hapus header yang mungkin menyebabkan masalah atau tidak relevan
      validateStatus: () => true, // Jangan melempar error untuk status non-2xx
    };

    // Pastikan config.headers tidak undefined sebelum dihapus
    if (config.headers) {
      delete config.headers['host'];
      delete config.headers['accept-encoding'];
    }

    this.logger.debug(`Konsolidasikan request: ${this.req.method} ${this.req.originalUrl} ke ${this.targetUrl}`);

    await this.beforeSubmit(config);

    try {
      const response = await lastValueFrom(
        this.proxyService.httpService.request(config).pipe(
          catchError(error => {
            this.logger.error(`Error mengkonsolidasikan request ke ${this.targetUrl}: ${error.message}`);
            const statusCode = error.response ? error.response.status : HttpStatus.BAD_GATEWAY;
            if (this.targetUrl.includes(this.proxyService.SATUSEHAT_PROD_URL) || this.targetUrl.includes(this.proxyService.SATUSEHAT_DEV_URL)) {
              throw new SatusehatApiException(
                error.message,
                ErrorCode.SATUSEHAT,
                statusCode,
                error
              );
            } else if (this.targetUrl.includes(this.proxyService.ASIK_CKG_PROD_URL) || this.targetUrl.includes(this.proxyService.ASIK_CKG_DEV_URL)) {
              throw new AsikCkgException(
                error.message,
                ErrorCode.CKG,
                statusCode,
                error
              );
            } else {
              const statusCode = error.response ? error.response.status : HttpStatus.BAD_GATEWAY;
              throw new SitbException(
                error.message,
                ErrorCode.SITB,
                statusCode,
                error
              );
            }
          }),
        )
      );

      this.logger.debug(`Menerima respon dari ${this.targetUrl} dengan status: ${response.status}`);

      this.transaction.response = {
        status: response.status,
        headers: response.headers as Record<string, string>,
        body: JSON.stringify(response.data),
        timestamp: new Date(),
      };
      this.transaction.status = response.status >= 200 && response.status < 400 ? 'Successful' : 'Completed';

      for (const key in response.headers) {
        if (response.headers.hasOwnProperty(key)) {
          this.res.setHeader(key, response.headers[key]);
        }
      }

      await this.afterSubmit(response);
      this.res.status(response.status).send(response.data);
      return response.data;
    } catch (error) {
      this.transaction.status = this.transaction.response && 
          this.transaction.response.status >= 200 && 
          this.transaction.response.status < 400 ? 
              'Completed with error(s)' : 'Failed';
              this.transaction.error = {
        message: error.message,
        stack: error.stack,
      };

      await this.afterSubmit(undefined, error);
      throw error;
    }
  }

  protected abstract beforeSubmit(config: AxiosRequestConfig);
  protected abstract afterSubmit(response?: AxiosResponse<any, any>, error?: any);
}