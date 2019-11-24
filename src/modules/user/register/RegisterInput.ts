import { Length, IsEmail, IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { isEmailAlreadyExist } from './isEmailAlreadyExist';

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @isEmailAlreadyExist({ message: '이미 존재하는 이메일입니다.' })
  // 아래처럼 쓸수도 있음
  // @Validate(isEmailAlreadyExistConstraint, {
  //   message: '이미 존재하는 이메일입니다.'
  // })
  email: string;

  @Field()
  @IsNotEmpty({ message: '암호를 입력해주세요.' })
  password: string;
}
