import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReceiversService } from './receivers.service';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';

@Controller()
export class ReceiversController {
  constructor(private readonly receiversService: ReceiversService) {}

  @MessagePattern('createReceiver')
  create(@Payload() createReceiverDto: CreateReceiverDto) {
    return this.receiversService.create(createReceiverDto);
  }

  @MessagePattern('findAllReceivers')
  findAll() {
    return this.receiversService.findAll();
  }

  @MessagePattern('findOneReceiver')
  findOne(@Payload() id: number) {
    return this.receiversService.findOne(id);
  }

  @MessagePattern('updateReceiver')
  update(@Payload() updateReceiverDto: UpdateReceiverDto) {
    return this.receiversService.update(updateReceiverDto.id, updateReceiverDto);
  }

  @MessagePattern('removeReceiver')
  remove(@Payload() id: number) {
    return this.receiversService.remove(id);
  }
}
