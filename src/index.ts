import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import session from 'express-session';
//import connectRedis from 'connect-redis';
import connectMongo from 'connect-mongo';
//import { redis } from './redis';
import { mongo } from './mongo';
import cors from 'cors';

import { RegisterResolver } from './modules/user/Register';
import { LoginResolver } from './modules/user/Login';
import { MeResolver } from './modules/user/Me';

const main = async () => {
  // DB 커넥션
  await createConnection();

  // RESOLVER 가져와서 스키마에 등록
  const schema = await buildSchema({
    resolvers: [MeResolver, RegisterResolver, LoginResolver]
  });

  // 서버에 스키마 등록
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
    playground: {
      settings: {
        'request.credentials': 'include'
      }
    }
  });

  const app = Express();

  //const RedisStore = connectRedis(session);
  const MongoStore = connectMongo(session);

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000'
    })
  );

  // 세션 설정
  app.use(
    session({
      // 레디스 방법
      // store: new RedisStore({
      //   client: redis
      // }),
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

  // EXPRESS 를 미들웨어로 등록
  apolloServer.applyMiddleware({ app });

  // cors 설정은 아래의 방법으로 해도 됨
  // apolloServer.applyMiddleware({
  //   app,
  //   cors: {
  //     origin: '*',
  //     credentials: true
  //   }
  // });

  // LISTEN 하기
  app.listen(4000, () => {
    console.log('server started on http://localhost:4000/graphql');
  });
};

main();
