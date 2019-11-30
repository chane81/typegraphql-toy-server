import Mongoose from 'mongoose';

export const mongo = Mongoose.createConnection('mongodb://127.0.0.1:27017', {
  dbName: 'graphql-toy-session',
  useUnifiedTopology: true,
  useNewUrlParser: true
});
