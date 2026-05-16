import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client();
}
