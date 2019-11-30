import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { MyContext } from '../types/MyContext';

@Resolver(User)
export class LoginResolver {
  // MUTATION - 삽입, 삭제, 수정
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    // 세션의 userId 에 로그인 리졸버에서 입력된 userId 를 저장한다/
    // 그리고 redis db 에 userId 값을 저장한다.
    ctx.req.session!.userId = user.id;

    console.log('session save:', ctx.req.session);

    return user;
  }
}
