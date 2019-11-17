import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root
} from 'type-graphql';
import { Like, getConnectionManager } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';

@Resolver(User)
export class RegisterResolver {
  // QUERY
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

  // FIELD RESOLVER - 해당 필드의 내용을 함수안의 로직으로 그리고 해당 필드가 속해있는 parent 필드들의 값을 가지고 처리된 값으로 채워넣음
  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  // MUTATION - 삽입, 삭제, 수정
  @Mutation(() => User)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    return user;
  }
}
