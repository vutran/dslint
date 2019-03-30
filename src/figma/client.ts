import http from 'http';
import got from 'got';

type ClientAuthKey = 'bearerAccessToken' | 'personalAccessToken';

export interface ClientOptions {
  bearerAccessToken?: string;
  personalAccessToken?: string;
}

export interface ClientAuthorizationHeaders extends http.OutgoingHttpHeaders {
  Authorization: string;
}

export interface ClientPersonalTokenHeaders extends http.OutgoingHttpHeaders {
  'X-Figma-Token': string;
}

export type ClientHeaders =
  | ClientAuthorizationHeaders
  | ClientPersonalTokenHeaders;

export class Client {
  private options: ClientOptions;
  private headers: ClientHeaders;

  public constructor(options: ClientOptions) {
    this.options = options;

    this.headers = options.bearerAccessToken
      ? { Authorization: `Bearer ${options.bearerAccessToken}` }
      : { 'X-Figma-Token': options.personalAccessToken };
  }

  public get(endpoint: string, options?: Object): got.GotPromise<AnyType> {
    const url = `https://api.figma.com/v1/${endpoint.replace(/^\//, '')}`;
    return got(url, {
      json: true,
      headers: this.headers,
      ...options,
    });
  }

  public file(key: string): got.GotPromise<FileResponse> {
    return this.get(`/files/${key}`);
  }

  public fileNodes(key: string): got.GotPromise<AnyType> {
    return this.get(`/files/${key}/nodes`);
  }

  public styles(key: string): got.GotPromise<AnyType> {
    return this.get(`/styles/${key}`);
  }
}
