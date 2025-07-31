import { Request, Response } from 'express';
import { Logger } from "@nestjs/common";
import { BaseProxyService } from "./service.base";
import { ProxyService } from '../proxy.service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export class ProxySitbService extends BaseProxyService {
  constructor(
    protected readonly proxyService: ProxyService,
    protected readonly envPrefix: string,
    protected readonly baseUrl: string,
    protected readonly targetUrl: string,
    protected readonly req: Request,
    protected readonly res: Response,
  ) {
    super(proxyService, envPrefix, baseUrl, targetUrl, req, res, new Logger(ProxySitbService.name))
  }

  protected async beforeSubmit(config: AxiosRequestConfig) {

  }
  protected async afterSubmit(response?: AxiosResponse<any, any>, error?: any) {
    
  }
}