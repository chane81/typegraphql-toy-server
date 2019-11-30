import { Resolver, Query, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { MyContext } from '../types/MyContext';

@Resolver()
export class MeResolver {
  // QUERY
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    console.log('userid:', ctx.req.session!);
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    return User.findOne(ctx.req.session!.userId);
  }
}
