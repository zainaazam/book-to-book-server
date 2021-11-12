import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './account.schema';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { hash, compare } from 'bcrypt';
import { LoginInput } from './dto/login.input';
import { CodeService } from 'src/code/code.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    private readonly codeService: CodeService,
  ) {}

  async create(createAccountInput: CreateAccountInput) {
    try {
      createAccountInput.email = createAccountInput.email.toLocaleLowerCase();
      let referral: string;
      const accountCheck = await this.accountModel.findOne({
        $or: [
          { email: createAccountInput.email },
          { phone: createAccountInput.email },
          { username: createAccountInput.email },
        ],
      });

      if (accountCheck) {
        throw new BadRequestException('email or phone already used');
      }

      const account = new this.accountModel({
        ...createAccountInput,
        email: createAccountInput.email.toLowerCase(),
        referral,
        created_at: new Date(),
        deleted: false,
      });

      if (createAccountInput.password && createAccountInput.password !== '') {
        account.password = await hash(createAccountInput.password, 10);
      }

      await account.save();
      return account;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    return this.accountModel.find();
  }

  async findOne(id: string) {
    return this.accountModel.findById(id);
  }

  async update({ id, password, ...updateAccountInput }: UpdateAccountInput) {
    try {
      let passwordHash = (await this.accountModel.findById(id)).password;
      if (password) {
        passwordHash = await hash(password, 10);
      }

      return this.accountModel.findOneAndUpdate(
        { _id: id },
        {
          ...updateAccountInput,
          password: passwordHash,
          name: 'ali',
          updated_at: new Date(),
        },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    return !!(await this.update({ id, deleted: true }));
  }

  async findAccount(emailPhoneOrUsername: string) {
    return this.accountModel.findOne({
      deleted: false,
      $or: [
        {
          email: {
            $exists: true,
            $eq: (emailPhoneOrUsername || '').toLowerCase(),
            $nin: ['', null],
          },
        },
        {
          phone: {
            $exists: true,
            $eq: (emailPhoneOrUsername || '').toLowerCase(),
            $nin: ['', null],
          },
        },
        {
          username: {
            $exists: true,
            $eq: (emailPhoneOrUsername || '').toLowerCase(),
            $nin: ['', null],
          },
        },
      ],
    });
  }

  async login({ password, ...loginInput }: LoginInput) {
    const account = await this.findAccount(loginInput.emailPhoneOrUsername);

    if (!account) {
      throw new BadRequestException(
        "Account doesn't exist or has been deleted",
      );
    }

    if (password && !(await compare(password, account.password))) {
      throw new BadRequestException('Incorrect credentials');
    }

    return account;
  }

  async forgotPassword(phoneEmailOrUSername: string) {
    const account = await this.findAccount(phoneEmailOrUSername);

    await this.codeService.sendForAccount(account);

    return true;
  }

  async verifyCode(code: string, phoneEmailOrUsername: string) {
    const account = await this.findAccount(phoneEmailOrUsername);
    if (!account) {
      throw new BadRequestException('Account Does Not Exist');
    }

    const verified = await this.codeService.verify(account, code);
    if (!verified) {
      throw new BadRequestException('Wrong Code');
    }

    return account.id;
  }

  async resetPassword(id: string, password: string) {
    return this.update({ id, password });
  }
}
