export interface ModelConstructor {
  new <T>(): Model<T>;
}

export class Model<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
