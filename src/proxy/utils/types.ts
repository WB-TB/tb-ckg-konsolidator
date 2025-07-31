export type ProxyHeaders = Record<string, string>;

export type ProxyRequestDefinition = {
  host: string;
  port: string;
  path: string;
  headers: ProxyHeaders;
  querystring: string;
  body: string;
  method: string;
  timestamp: Date;
};

export type ProxyResponseDefinition = {
  status: number;
  headers: ProxyHeaders;
  body: string;
  timestamp: Date;
};

export type ProxyStatus = 'Processing' | 'Failed' | 'Completed' | 'Successful' | 'Completed with error(s)';

export type ProxyError = {
  message: string;
  stack: string;
};

export type ProxyTransaction = {
  transactionId: string;
  request: ProxyRequestDefinition;
  retry: boolean;
  retryAttempt: number,
  status: ProxyStatus;
  response?: ProxyResponseDefinition;
  error?: ProxyError;
};
