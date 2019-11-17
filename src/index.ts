import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';

const main = async () => {
  // DB 커넥션
  await createConnection();

  // RESOLVER 가져와서 스키마에 등록
  const schema = await buildSchema({
    resolvers: [RegisterResolver]
  });

  // 서버에 스키마 등록
  const apolloServer = new ApolloServer({ schema });
  const app = Express();

  // EXPRESS 를 미들웨어로 등록
  apolloServer.applyMiddleware({ app });

  // LISTEN 하기
  app.listen(4000, () => {
    console.log('server started on http://localhost:4000/graphql');
  });
};

main();
