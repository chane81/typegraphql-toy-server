import { IsNotEmpty, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class PasswordInput {
  @Field()
  @IsNotEmpty({ message: '암호를 입력해주세요.' })
  @Length(4)
  password: string;
}
