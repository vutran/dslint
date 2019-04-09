import got from 'got';

export class Client implements Figma.Client.Client {
  private options: Figma.Client.Options;
  private headers: Figma.Client.Headers;

  public constructor(options: Figma.Client.Options) {
    this.options = options;

    this.headers = options.bearerAccessToken
      ? {Authorization: `Bearer ${options.bearerAccessToken}`}
      : {'X-Figma-Token': options.personalAccessToken};
  }

  public get(endpoint: string, options?: got.GotJSONOptions) {
    const url = `https://api.figma.com/v1/${endpoint.replace(/^\//, '')}`;
    return got(
      url,
      Object.assign({}, options, {json: true, headers: this.headers})
    );
  }

  public file(key: string): got.GotPromise<Figma.File> {
    return this.get(`/files/${key}`);
  }

  public fileNodes(key: string): got.GotPromise<Figma.AnyType> {
    return this.get(`/files/${key}/nodes`);
  }

  public styles(key: string): got.GotPromise<Figma.AnyType> {
    return this.get(`/styles/${key}`);
  }
}
