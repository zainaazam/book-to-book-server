import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeSchema, Code } from './code.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }]),
  ],
  providers: [CodeService],
  exports: [CodeService, MongooseModule],
})
export class CodeModule {}
