# 1. 참고

- ### TypeGraphqhQL 참고 URL

  > https://typegraphql.ml/docs/getting-started.html

- ### TypeOrm 참고

  > https://typeorm.io

- ### Postgres DB 참고

  - 기본 URL

    > https://www.postgresql.org

  - 참고

    - 12버전을 설치 후 ormconfig.json 에서 "synchronize": true 로 설정시에 아래와 같은 에러가 발생한다. 11버전으로 다운로드 받아서 설치 할 것

    > error: cnst.consrc 칼럼 없음
    > 참고 URL : https://github.com/typeorm/typeorm/issues/5084

  - 설치파일

    > https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

  - CMD 에서 PostGreSQL 명령어를 실행시키고 싶다면 시스템 환경변수 Path 에 PostgresSQL 이 설치된 bin 폴더의 경로를 추가해 주면 된다.

    > 제어판\모든 제어판 항목\시스템\고급 시스템 설정 > 시스템 속성 > 고급텝 > 하단 환경변수 버튼 클릭 > 시스템 변수 > Path 선택 후 편집버튼 클릭 > C:\Program Files\PostgreSQL\11\bin 추가

  - QUERY - TABLE CREATE

    ```sql
    CREATE TABLE "user" (
      "id"          SERIAL NOT NULL,
      "firstName"   CHARACTER VARYING NOT NULL,
      "lastName"    CHARACTER VARYING NOT NULL,
      "email"       TEXT NOT NULL,
      "password"    CHARACTER VARYING NOT NULL,
      UNIQUE ("email"),
      PRIMARY KEY ("id")
    )
    ```

  - QUERY - LIKE SELECT

    ```sql
    SELECT "id", "firstName", "email", "password", "lastName"
    FROM public.user
    WHERE "lastName" LIKE '%' || '식' || '%'
    ```

  - QUERY - CREATE FUNCTION

    ```sql
    CREATE OR REPLACE FUNCTION public.proc_get_user(in_lastName VARCHAR(32))
    RETURNS TABLE("id" INTEGER, "firstName" VARCHAR(32), "lastName" VARCHAR(32), "email" TEXT,"password" VARCHAR(100)) AS
    $$
    BEGIN
      RETURN QUERY SELECT
          u."id"
        , u."firstName"
        , u."lastName"
        , u."email"
        , u."password"
      FROM public.user as u
      WHERE u."lastName" LIKE '%' || in_lastName || '%';
    END;
    $$
    LANGUAGE 'plpgsql';

    SELECT * FROM public.get_user('환');
    ```

# 2. setup

- ## 1) yarn 설치

  ```
  yarn add apollo-server-express express graphql reflect-metadata type-graphql
  yarn add -D @types/express @types/graphql @types/node nodemon ts-node typescript
  yarn add -D ts-node-dev @types/bcryptjs
  yarn add pg typeorm bcryptjs reflect-metadata class-validator
  yarn add @types/bcryptjs
  ```

- ## 2) typeorm 을 쓰기위해 config 파일 생성

  - ormconfig.json

  ```json
  {
    "name": "default",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "chane",
    "password": "1111",
    "database": "typegraphql-example",
    "synchronize": true,
    "logging": true,
    "entities": ["src/entity/*.*"]
  }
  ```

# 3. ENTITY 생성 및 선언

- ## `생성된 class 파일로 Graphql 엔티티와 DB 엔티티로 사용을 할 수 있다.`

- ## 예제

  ```js
  import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
  import { ObjectType, Field, ID } from 'type-graphql';

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
  }
  ```

- ## [TypeORM] DB ENTITY 로 쓰일 CLASS 생성

  - ## typeorm 모듈 사용
    ```js
    import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      BaseEntity
    } from 'typeorm';
    ```
  - @Entity()

    > 클래스위에 선언

    > 해당 class가 DB의 TABLE에 해당한다

  - @PrimaryGeneratedColumn

    > PRIMARY KEY 필드위에 선언

    > 클래스의 해당 필드가 DB의 PK COLUMN 에 해당한다

  - @Column()

    > 필드위에 선언

    > 클래스의 해당 필드가 DB의 COLUMN 에 해당한다

- ## Graphql Field 생성 및 선언

  - ## type-graphql 모듈 사용

    ```js
    import { ObjectType, Field, ID } from 'type-graphql';
    ```

  - @ObjectType()

    > 클래스위에 선언

    > 해당 class 가 graphQL 의 DTO 로 쓰인다

  - @Field(() => ID)

    > 필드위에 선언

    > 클래스의 해당 필드가 ID(유니크하다는 뜻)에 해당 한다

  - @Field()

    > 필드위에 선언

    > 클래스의 해당 필드가 graphQL 의 데이터 필드로 쓰인다

- ## Validation
  - graphql 의 args에 대한 Validation 체크로 class-validator 모듈을 사용
  - 참고 URL
    - https://typegraphql.ml/docs/validation.html
