import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { resolve } from 'path';
import * as sharp from 'sharp';
import * as convert from 'heic-convert';
import { Response, Request } from 'express';
import { UploadService } from './upload.service';

export interface Image {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

export const fileFilter = (
  req: Request,
  file: Image,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file.originalname.toLowerCase().match(/\.(heic|jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException('Invalid file type!', HttpStatus.BAD_REQUEST),
      false,
    );
  }

  callback(null, true);
};

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter,
    }),
  )
  async upload(@UploadedFile() image: Image) {
    const originalImage = sharp(
      image.mimetype === 'image/heic'
        ? await convert({
            buffer: image.buffer,
            format: 'JPEG',
            quality: 1,
          })
        : image.buffer,
    );

    const imageNewName = await this.uploadService.renameFile(
      image.originalname,
    );

    await originalImage
      .resize(700)
      .toFile(
        resolve(__dirname, `../../public/uploads/${imageNewName.filename}`),
      );

    originalImage
      .resize(200)
      .toFile(
        resolve(__dirname, `../../public/uploads/${imageNewName.thumbnail}`),
      );

    return this.uploadService.create({
      ...imageNewName,
      type: image.mimetype,
    });
  }

  @Get(':image')
  async seeUploadedFile(
    @Param('image') image: string,
    @Query('size') size: number,
    @Res() res: Response,
  ) {
    if (size && !isNaN(size)) {
      const scaledImage = sharp(
        resolve(__dirname, `../../public/uploads/${image}`),
      );

      const bufferImage = await scaledImage.resize(+size).toBuffer();

      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': bufferImage.length,
      });

      return res.end(bufferImage);
    }

    return res.sendFile(image, { root: './public/uploads' });
  }
}
