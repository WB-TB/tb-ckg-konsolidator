import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ProxyTransaction } from './utils/types';
import { BaseProxyService } from './services/service.base';
import { ProxySitbService } from './services/service.sitb';
import { ProxyCkgService } from './services/service.ckg';
import { ProxySatusehatService } from './services/service.satusehat';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  public readonly SATUSEHAT_PROD_URL: string;
  public readonly SATUSEHAT_DEV_URL: string;
  public readonly ASIK_CKG_PROD_URL: string;
  public readonly ASIK_CKG_DEV_URL: string;
  public readonly SITB_PROD_URL: string;
  public readonly SITB_DEV_URL: string;

  constructor(
    public readonly httpService: HttpService,
    public readonly configService: ConfigService,
  ) {
    this.SATUSEHAT_PROD_URL = process.env.SATUSEHAT_PROD_URL || 'https://api-satusehat.kemkes.go.id';
    this.SATUSEHAT_DEV_URL = process.env.SATUSEHAT_DEV_URL || 'https://api-satusehat-stg.dto.kemkes.go.id';
    this.ASIK_CKG_PROD_URL = process.env.ASIK_CKG_PROD_URL || 'http://internal-svc.internal.svc.cluster.local';
    this.ASIK_CKG_DEV_URL = process.env.ASIK_CKG_DEV_URL || 'http://internal-svc.internal-dev.svc.cluster.local';
    this.SITB_PROD_URL = process.env.SITB_PROD_URL || 'http://internal-svc.internal.svc.cluster.local';
    this.SITB_DEV_URL = process.env.SITB_DEV_URL || 'http://internal-svc.internal-dev.svc.cluster.local';

    this.logger.log(`SATUSEHAT_PROD_URL: ${this.SATUSEHAT_PROD_URL}`);
    this.logger.log(`SATUSEHAT_DEV_URL: ${this.SATUSEHAT_DEV_URL}`);
    this.logger.log(`ASIK_CKG_PROD_URL: ${this.ASIK_CKG_PROD_URL}`);
    this.logger.log(`ASIK_CKG_DEV_URL: ${this.ASIK_CKG_DEV_URL}`);
    this.logger.log(`SITB_PROD_URL: ${this.SITB_PROD_URL}`);
    this.logger.log(`SITB_DEV_URL: ${this.SITB_DEV_URL}`);
  }

  getSatusehatBaseUrl(env: string): string {
    if (env === 'prod') {
      return this.SATUSEHAT_PROD_URL;
    }
    // Default atau 'dev'
    return this.SATUSEHAT_DEV_URL;
  }

  getAsikCkgBaseUrl(env: string): string {
    if (env === 'prod') {
      return this.ASIK_CKG_PROD_URL;
    }
    // Default atau 'dev'
    return this.ASIK_CKG_DEV_URL;
  }

  getSitbBaseUrl(env: string): string {
    if (env === 'prod') {
      return this.SITB_PROD_URL;
    }
    // Default atau 'dev'
    return this.SITB_DEV_URL;
  }

  async proxyRequest(
    req: Request,
    res: Response,
    backend: string,
    targetUrl: string,
    envPrefix: string,
  ): Promise<any>{
    const hostHeader = (req.headers.host || '').split(':');
    const reqId = req.headers['x-request-id'] as string;
    const traceId = req.headers['x-trace-id'] as string;
    const transactionId = reqId || traceId || uuidv4();
    let service: BaseProxyService;
    let baseUrl: string;

    if (backend === 'satusehat') {
      baseUrl = this.getSatusehatBaseUrl(envPrefix);
      service = new ProxySitbService(this, envPrefix, baseUrl, targetUrl, req, res);
    } else if (backend === 'ckg') {
      baseUrl = this.getAsikCkgBaseUrl(envPrefix);
      service = new ProxyCkgService(this, envPrefix, baseUrl, targetUrl, req, res);
    } else {
      baseUrl = this.getSitbBaseUrl(envPrefix);
      service = new ProxySatusehatService(this, envPrefix, baseUrl, targetUrl, req, res);
    }

    if (reqId || traceId)
      this.logger.debug(`X-Request-ID: ${reqId}, Trace-ID: ${traceId}`);

    const transaction: ProxyTransaction = {
      transactionId,
      request: {
        host: hostHeader[0],
        port: hostHeader[1] || '',
        path: req.originalUrl,
        headers: req.headers as Record<string, string>,
        querystring: JSON.stringify(req.query),
        body: JSON.stringify(req.body),
        method: req.method,
        timestamp: new Date(),
      },
      retry: false,
      retryAttempt: 0,
      status: 'Processing',
      response: undefined,
      error: undefined,
    };
    service.setTransaction(transaction);

    return service.sendRequest();
  }
}