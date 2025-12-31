import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private client: Minio.Client;
  private bucket: string;

  onModuleInit() {
    this.bucket = process.env.MINIO_BUCKET || 'hireup';

    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  async ensureBucket(bucketName?: string) {
    const targetBucket = bucketName || this.bucket;
    const exists = await this.client.bucketExists(targetBucket);
    if (!exists) {
      await this.client.makeBucket(targetBucket, 'us-east-1');
    }
  }

  async upload(
    file: Express.Multer.File,
    folder = 'files',
    bucketName?: string,
  ) {
    const targetBucket = bucketName || this.bucket;
    await this.ensureBucket(targetBucket);

    const objectName = `${folder}/${Date.now()}-${file.originalname}`;

    await this.client.putObject(
      targetBucket,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return {
      bucket: targetBucket,
      objectName,
      url: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${targetBucket}/${objectName}`,
    };
  }
}
