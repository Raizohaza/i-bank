import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<string, Types.ObjectId>
{
  transform(value: string): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException('Invalid ObjectId');
    }

    return new mongoose.Types.ObjectId(value);
  }
}
