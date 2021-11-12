import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { AccountDocument } from 'src/account/account.schema';

import { Code, CodeDocument } from './code.schema';

@Injectable()
export class CodeService {
  constructor(
    @InjectModel(Code.name) private readonly codeModel: Model<CodeDocument>,
  ) {}

  private generate() {
    // return Math.floor(Math.random() * 90000) + 10000;
    return '1111';
  }

  async sendForAccount(account: AccountDocument) {
    const code = this.generate();

    const codeDocument = new this.codeModel({
      code,
      account,
      expiry_date: moment().add(10, 'minute'),
    });

    await codeDocument.save();

    return code;
  }

  async findAll() {
    return this.codeModel.find();
  }

  async findOne(id: string) {
    return this.codeModel.findById(id);
  }

  async verify(account: AccountDocument, code: string) {
    return !!(await this.codeModel.findOneAndUpdate(
      {
        account: account.id,
        code,
        valid: true,
        expiry_date: { $gt: new Date() },
      },
      { $set: { valid: false, updated_at: new Date() } },
      { new: true },
    ));
  }
}
