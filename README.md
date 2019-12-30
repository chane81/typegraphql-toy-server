# 0. 설치

- yarn

  - dependencies

    ```
    ## 아폴로서버, express 서버, graphql, typeorm
    yarn add apollo-server-express graphql type-graphql typeorm class-validator express

    ## 기타(cors 등등)
    yarn add cors bcryptjs pg

    ## 세션관련
    yarn add express-session connect-redis ioredis cors
    ```

  - dev dependencies

    ```
    ## graphql, express, node, typescript
    yarn add -D @types/graphql @types/express @types/node typescript

    ## 기타
    yarn add -D @types/bcryptjs

    ## 실행 유틸(scripts start)
    yarn add -D nodemon ts-node-dev

    ## 세션
    yarn add -D @types/express-session @types/connect-redis @types/ioredis @types/cors
    ```

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
    CREATE OR REPLACE FUNCTION public.get_user(in_lastName VARCHAR(32))
    RETURNS TABLE("id" INTEGER, "firstName" VARCHAR(32), "lastName" VARCHAR(32), "email" TEXT,"password" VARCHAR(100)) AS
    $$
    BEGIN
      RETURN QUERY
      SELECT
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

# 4. Validation

- ## graphql 의 args에 대한 Validation 체크로 class-validator 모듈을 사용
- ## 참고 URL

  - https://typegraphql.ml/docs/validation.html
  - https://github.com/typestack/class-validator

# 5. 세션 관리 & AUTH & CORS

- ## 세션관리 및 로그인

  - 세션저장은 Redis 또는 Mongo DB 를 이용 했음

    - 필요한 의존 PACKAGE

      > express, express-session, @types/express, @types/express-session

      > mongoose, connect-mongo, @types/mongoose, @types/connect-mongo

      > ioredis, connect-redis, @types/ioredis, @types/connect-redis

  - CODE

    - Mongo DB

      ```js
      import session from 'express-session';
      import connectMongo from 'connect-mongo';
      import Mongoose from 'mongoose';

      const MongoStore = connectMongo(session);
      const mongo = Mongoose.createConnection('mongodb://127.0.0.1:27017', {
        dbName: 'graphql-toy-session',
        useUnifiedTopology: true,
        useNewUrlParser: true
      });

      // 세션 설정
      const app = Express();

      app.use(
        session({
          store: new MongoStore({
            mongooseConnection: mongo
          }),
          name: 'qid',
          secret: 'mytest1122',
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
          }
        })
      );
      ```

    - Redis DB

      ```js
      import session from 'express-session';
      import connectRedis from 'connect-redis';
      import Redis from 'ioredis';

      const redis = new Redis({
        port: 6379
      });

      const RedisStore = connectRedis(session);

      // 세션 설정
      app.use(
        session({
          // 레디스 방법
          store: new RedisStore({
            client: redis
          }),
          name: 'qid',
          secret: 'mytest1122',
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
          }
        })
      );
      ```

  - 로그인 예시

    - 로그인 모듈에서 Request Context 를 Login Mutation 리졸버 호출시에 userId 를 세션에 저장하도록 함
    - 클라이언트에서 Login 리졸버 호출했을 때 서버에서는 Mongo DB OR Redis DB 에 세션정보를(userId 포함)저장 하고 클라이언트로 암호화된 세션정보를 보내면 클라이언트는 쿠키로 해당 세션정보를 저장한다.
    - 추후 클라이언트에서 서버로 데이터 요청시 인증된 사용자인지 체크할 때 저장된 세션쿠키 정보를 서버로 날리게 되는데 그 때 서버에서 인증된 사용자 인지를 체크 할 수 있다.
    - /modules/user/Login.ts 모듈 참고

- ## CORS 관련

  - GraphQL 에서 CORS 설정을 2가지 방법으로 할 수 있다.

    - 1번째 방법은 cors 모듈을 설치해서 사용하는 방법. 아래 코드 참고

      ```js
      import cors from 'cors';
      import { ApolloServer } from 'apollo-server-express';

      const app = Express();

      app.use(
        cors({
          origin: 'http://localhost:3000',
          credentials: true
        })
      );

      // EXPRESS 를 미들웨어로 등록
      apolloServer.applyMiddleware({ app });
      ```

    - 2번째 방법은 cors 모듈을 설치하지 않고 사용하는 방법. 아래 코드 참고

      ```js
      import { ApolloServer } from 'apollo-server-express';

      apolloServer.applyMiddleware({
        app,
        cors: {
          origin: 'http://localhost:3000',
          credentials: true
        }
      });
      ```

  - request.credentials

    - 설명

      - cross-origin 요청의 경우, user agent가 다른 도메인으로부터 cookie 들을 전달해야만 하는가 아닌가를 나타낸다
      - 참고 url: MDN web docs
        - https://developer.mozilla.org/ko/docs/Web/API/Request/credentials
      - playground 에서 Login 모듈 호출하여 테스트시에 작동이 잘 되지 않아서 settings 에서 살펴보니 request.credentials 설정이 omit 로 되어있어 include 로 설정을 바꾸었다.
      - 추후 프론트엔트 페이지에서 graphql 사용시에 apollo-link-http 모듈 사용시에 request.credentials 설정을 사용할 수 있으므로 참고 해야한다.

        ```js
        import { createHttpLink } from 'apollo-link-http';

        const httpLink = createHttpLink({
          uri: 'http://localhost:4000/graphql'
          // 종류: omit(생략), include(다른 도메인일 경우), same-origin(같은 도메인일 경우)
          credentials: 'same-origin'
        });
        ```

    - 종류
      - include
        > cross-origin 호출이라 할지라도 언제나 user credentials (cookies, basic http auth 등..)을 전송한다.
      - same-origin
        > URL이 호출 script 와 동일 출처(same origin)에 있다면, user credentials (cookies, basic http auth 등..)을 전송한다. 이것은 default 값이다.
      - omit
        > 절대로 cookie 들을 전송하거나 받지 않는다.

- ## Auth

  - 참고 url
    > https://typegraphql.ml/docs/authorization.html#how-to-use
  - @Authorized() 데코레이션을 resolver의 쿼리/뮤테이션 함수위에 작성하여 쓴다.

    - ex)
      ```js
      @Authorized()
      @Query(() => String)
      async hello() {
        return 'Hello World!';
      }
      ```

  - 단, 쓰기위해서는 buildSchema 에 auth 조건을 등록하여야 쓸 수 있다.

    - ex)
      ```js
      const schema = await buildSchema({
        resolvers: [MeResolver, RegisterResolver, LoginResolver],
        authChecker: ({ context: { req } }) => {
          return !!req.session.userId;
        }
      });
      ```

# 6. Middleware

- ## 참고

  - url

    > https://typegraphql.ml/docs/middlewares.html

  - 아래와 같이 MiddlewareFn 형식의 함수를 만들어서 resolver의 쿼리/뮤테이션 함수위에 작성하여 쓴다.
  - 총 4개의 인자를 쓸 수 있으며 인자의 종류는 아래와 같다.

    > root, args, context, info

- ## ex) 미들웨어 모듈 작성

  ```js
  export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session!.userId) {
      throw new Error('not Authenticated');
    }

    return next();
  };

  export const logger: MiddlewareFn<MyContext> = async ({ args }, next) => {
    console.log('args: ', args);

    return next();
  };
  ```

- ## ex) 쿼리/뮤테이션 함수에서 미들웨어 사용
  - src/modules/user/Register.ts 참고
  ```js
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }
  ```

# 7. 사용자 등록시 인증메일 보내기, 로그인시 인증하지 않은 유저는 로그인 false 되게

- ## 이메일 보내기

  - nodemailer 모듈
  - 참고 url

    - https://nodemailer.com/

- ## 인증
  - 관계된 파일
    - modules/user/ConfirmUser.ts
    - modules/user/Register.ts
    - modules/utils/createConfirmationUrl.ts
    - modules/utils/sendEmail.ts
  - 인증절차
    - ㄱ. 사용자등록 리졸버(Register 리졸버) 호출
    - ㄱ. Register 리졸버에서 createConfirmationUrl() 호출하여 인증토큰이 url 파라메터로 포함된 인증 url 생성
      - url 생성시 redis 에 (key: 토큰, value: userId) 값 저장
    - ㄴ. 인증토큰 url 을 메일 내용에 포함하여 이메일 보냄
    - ㄷ. confirmUser 리졸버에서 이메일 내용에 포함된 토큰을 가지고 인증 데이터 update
      - postgres DB 의 User.confirmed 데이터를 true 로 update
      - redis 의 해당 key: 토큰 값을 제거
