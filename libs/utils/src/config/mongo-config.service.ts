import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

export class MongoConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri:
        process.env.MONGO_DSN ||
        'mongodb://localhost:27017/ibank' ||
        'mongodb+srv://web100:zzz456zzz@cluster0.pvkop.mongodb.net/?retryWrites=true&w=majority',
    };
  }
}
