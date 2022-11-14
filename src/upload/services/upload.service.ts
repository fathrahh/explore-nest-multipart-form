import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UploadService {
  private client = new OSS({
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
  });

  async uploadFile(file: Express.Multer.File) {
    const { originalname, mimetype, buffer } = file;
    const extention = originalname.split('.').pop();
    const newName = (await bcrypt.hash(originalname, 10))
      .replace(/\//g, '')
      .concat('.', extention);
    const result = await this.client.put(newName, buffer, {
      mime: mimetype,
    });

    return result;
  }

  async deleteFile(key: string) {
    const result = await this.client.delete(key);
    return result;
  }

  async getFile(keys: string[]): Promise<string[]> {
    return keys.map((key) => this.client.signatureUrl(key, { expires: 3600 }));
  }
}
