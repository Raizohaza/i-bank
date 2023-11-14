import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReceiversService } from './receivers.service';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';

@Controller()
export class ReceiversController {
  constructor(private readonly receiversService: ReceiversService) {}

  @MessagePattern('createReceiverAbine')
  createReceiverAbine(@Payload() createReceiverDto: CreateReceiverDto) {
    return this.receiversService.createReceiverAbine(createReceiverDto);
  }
  @MessagePattern('createReceiver')
  create(@Payload() createReceiverDto: CreateReceiverDto) {
    return this.receiversService.create(createReceiverDto);
  }
  @MessagePattern('createByAccountNumber')
  createByAccountNumber(@Payload() createReceiverDto: CreateReceiverDto) {
    console.log('Receivers', createReceiverDto);
    return this.receiversService.createByAccountNumber(createReceiverDto);
  }
  @MessagePattern('findAllReceivers')
  findAll() {
    return this.receiversService.findAll();
  }

  @MessagePattern('findAllReceiversByLoginCustomerId')
  findAllByLoginCustomerId(@Payload() id: string) {
    return this.receiversService.findAllByLoginCustomerId(id);
  }

  @MessagePattern('findAllReceiversByCustomerId')
  findAllByCustomerId(@Payload() id: string) {
    return this.receiversService.findAllByCustomerId(id);
  }
  @MessagePattern('findOneReceiver')
  findOne(@Payload() id: string) {
    return this.receiversService.findOne(id);
  }

  @MessagePattern('updateReceiver')
  update(@Payload() updateReceiverDto: UpdateReceiverDto) {
    return this.receiversService.update(
      updateReceiverDto.id,
      updateReceiverDto
    );
  }

  @MessagePattern('removeReceiver')
  remove(@Payload() id: string) {
    return this.receiversService.remove(id);
  }
}
