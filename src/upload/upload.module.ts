import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Upload, UploadSchema } from './upload.schema';

@Module({
  imports: [
    MulterModule.register({
      dest: './public',
      limits: {
        fileSize: 25 * 1024 * 1024,
        fieldSize: 25 * 1024 * 1024,
      },
    }),
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [MongooseModule],
})
export class UploadModule {}
