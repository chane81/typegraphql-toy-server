import {
  Resolver,
  Query,
  Mutation,
  Arg,
  //Authorized,
  UseMiddleware
} from 'type-graphql';
import { Like, getConnectionManager } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/createConfirmationUrl';

@Resolver(User)
export class RegisterResolver {
  // QUERY
  // Auth 체크 2가지 방법
  // 1. @Authorized() 데코레이션 사용
  // 2. @UseMiddleware(...) 데코레이션 사용
  //@Authorized()
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  // QUERY - FIND User (USE lastName)
  @Query(() => [User])
  async findUser(@Arg('lastName') lastName: string): Promise<User[]> {
    // 엔티티를 이용하여 FIND
    const user2 = await User.find({
      lastName: Like(`%${lastName}%`)
    });

    console.log(user2);

    // DB FUNCTION CALL
    const manager = await getConnectionManager().get();
    const query = `SELECT * FROM public.get_user($1)`;
    const user = manager.query(query, [lastName]);

    return user;
  }

  // MUTATION - 삽입, 삭제, 수정
  @Mutation(() => User)
  async register(
    @Arg('data') { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    const sendUrl = await createConfirmationUrl(user.id);
    await sendEmail(email, sendUrl);

    return user;
  }
}
