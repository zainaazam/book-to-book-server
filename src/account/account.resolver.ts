import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { LoginInput } from './dto/login.input';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Mutation(() => Account)
  createAccount(
    @Args('createAccountInput') createAccountInput: CreateAccountInput,
  ) {
    return this.accountService.create(createAccountInput);
  }

  @Query(() => [Account])
  findAllAccounts() {
    return this.accountService.findAll();
  }

  @Query(() => Account)
  findAccountById(@Args('id', { type: () => String }) id: string) {
    return this.accountService.findOne(id);
  }

  @Mutation(() => Account)
  updateAccount(
    @Args('updateAccountInput') updateAccountInput: UpdateAccountInput,
  ) {
    return this.accountService.update(updateAccountInput);
  }

  @Mutation(() => Boolean)
  removeAccount(@Args('id', { type: () => String }) id: string) {
    return this.accountService.remove(id);
  }

  @Mutation(() => Account, { nullable: true, description: 'Account login' })
  accountLogin(@Args('loginInput') loginInput: LoginInput) {
    return this.accountService.login(loginInput);
  }

  @Mutation(() => Boolean)
  forgotPassword(@Args('phoneEmailOrUsername') phoneEmailOrUsername: string) {
    return this.accountService.forgotPassword(phoneEmailOrUsername);
  }

  @Mutation(() => String)
  verifyCode(
    @Args('code') code: string,
    @Args('phoneEmailOrUsername') phoneEmailOrUsername: string,
  ) {
    return this.accountService.verifyCode(code, phoneEmailOrUsername);
  }

  @Mutation(() => Account)
  resetPassword(
    @Args('account_id') account_id: string,
    @Args('password') password: string,
  ) {
    return this.accountService.resetPassword(account_id, password);
  }
}
