import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

// Column() 프로퍼티 정의는 DB TABLE 정의와 동기화
// Field() 프로퍼티는 graphQL 에서 리턴되는 필드들
// name 필드는 User 클래스의 firstName + lastName 조합으로 표시되는것으로 DB에는 들어가지 않기 때문에 @Column() 프로퍼티가 없다.
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Field()
  name: string;

  @Column()
  password: string;
}
