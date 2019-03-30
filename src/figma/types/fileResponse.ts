import { Model } from './model';
import { Document, IDocument } from './nodes/document';

export interface IFileResponse {
  name: string;
  lastModified: string;
  thumbnailURL: string;
  version: string;
  document: Document;
  components: AnyType;
  schemaVersion: number;
  styles: AnyType;
}

export class FileResponse extends Model<IFileResponse> {
  // assert AnyType since we're passing in raw data
  constructor(data: AnyType) {
    super(data);
    this.data.document = new Document(data.document);
  }
}
