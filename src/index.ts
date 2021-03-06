import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import session from 'express-session';
import connectRedis from 'connect-redis';
//import connectMongo from 'connect-mongo';
//import { mongo } from './mongo';
import { redis } from './redis';
import cors from 'cors';

const main = async () => {
  // Nodemailer 모듈을 사용할 때 SSL 관련 에러 메시지를 본다면 아래와 같이 세팅
  // 메시지: UnhandledPromiseRejectionWarning: Error: self signed certificate in certificate chain
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // DB 커넥션
  await createConnection();

  // RESOLVER 가져와서 스키마에 등록
  const schema = await buildSchema({
    resolvers: [__dirname + '/modules/**/*.ts'],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
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

  const RedisStore = connectRedis(session);
  //const MongoStore = connectMongo(session);

  // cors 설정
  const whitelist = ['http://localhost:3000'];
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (whitelist.indexOf(origin!) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    })
  );

  // 세션 설정
  app.use(
    session({
      // 레디스 방법
      store: new RedisStore({
        client: redis
      }),
      // store: new MongoStore({
      //   mongooseConnection: mongo
      // }),
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
  apolloServer.applyMiddleware({ app, cors: false });

  // cors 설정은 아래의 방법으로 해도 됨
  // apolloServer.applyMiddleware({
  //   app,
  //   cors: {
  //     origin: '*',
  //     credentials: true
  //   }
  // });

  // LISTEN 하기
  app.listen(4000, async () => {
    console.log('server started on http://localhost:4000/graphql');
  });
};

main();
