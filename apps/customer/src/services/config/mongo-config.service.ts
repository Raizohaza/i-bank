import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

export class MongoConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri:
        process.env.MONGO_DSN ||
        'mongodb+srv://web100:zzz456zzz@cluster0.pvkop.mongodb.net/?retryWrites=true&w=majority',
    };
  }
}
