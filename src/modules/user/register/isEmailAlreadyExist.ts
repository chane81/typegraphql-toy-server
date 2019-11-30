import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator
} from 'class-validator';
import { User } from '../../../entity/User';
import { ClassType } from 'type-graphql';

// 커스텀 유효검사 로직 구현 CLASS
@ValidatorConstraint({ async: true })
export class isEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({ where: { email } }).then(user => {
      if (user) return false;
      return true;
    });
  }
}

// 데코레이터에 쓰일 함수
// export const isEmailAlreadyExist = (validationOptions?: ValidationOptions) => {
//   return (object: Object, propertyName: string) => {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: isEmailAlreadyExistConstraint
//     });
//   };
// };

// 데코레이션용 - 이메일 벨리데이션 함수
export const isEmailAlreadyExist = (validationOptions?: ValidationOptions) => {
  return validateFunction(isEmailAlreadyExistConstraint, validationOptions);
};

// 커스텀 벨리데이션에 쓰일 공통 함수
const validateFunction = (
  validatorClass: ClassType,
  validationOptions?: ValidationOptions
) => (object: Object, propertyName: string) => {
  registerDecorator({
    target: object.constructor,
    propertyName: propertyName,
    options: validationOptions,
    constraints: [],
    validator: validatorClass
  });
};
