import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Upload, UploadDocument } from './upload.schema';
import { extname } from 'path';
import { CreateUploadInput } from './dto/create-upload';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload.name) readonly uploadModel: Model<UploadDocument>,
  ) {}

  async create(createUploadInput: CreateUploadInput) {
    const upload = new this.uploadModel({ ...createUploadInput });
    await upload.save();
    return upload;
  }

  async renameFile(originalname: string) {
    const unique = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 32).toString(32))
      .join('');

    return {
      filename: `${originalname.split('.')[0]}-${unique}${
        extname(originalname) === '.heic' ? '.jpg' : extname(originalname)
      }`,
      thumbnail: `${originalname.split('.')[0]}-${unique}-thumbnail${
        extname(originalname) === '.heic' ? '.jpg' : extname(originalname)
      }`,
    };
  }
}
