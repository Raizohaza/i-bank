import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
} from '@nestjs/common';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';
import { Authorization } from '../../decorators/authorization.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { IAuthorizedRequest } from '../../interfaces/common/authorized-request.interface';
import { firstValueFrom } from 'rxjs';

@Controller('receiver')
export class ReceiverController {
  constructor(
    @Inject('RECEIVER_SERVICE') private readonly receiverService: ClientProxy
  ) {}

  @Post()
  @Authorization(true)
  async create(@Body() createReceiverDto: CreateReceiverDto) {
    const result = await firstValueFrom(
      this.receiverService.send('createReceiver', createReceiverDto)
    );
    return result;
  }

  @Get()
  @Authorization(true)
  async findAll() {
    const result = await firstValueFrom(
      this.receiverService.send('findAllReceivers', {})
    );
    return result;
  }

  @Get(':id')
  async findOne(@Req() request: IAuthorizedRequest, @Param('id') id: string) {
    const result = await firstValueFrom(
      this.receiverService.send('findOneReceiver', id)
    );
    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReceiverDto: UpdateReceiverDto
  ) {
    updateReceiverDto.id = id;
    const result = await firstValueFrom(
      this.receiverService.send('updateReceiver', updateReceiverDto)
    );
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await firstValueFrom(
      this.receiverService.send('removeReceiver', id)
    );
    return result;
  }
}