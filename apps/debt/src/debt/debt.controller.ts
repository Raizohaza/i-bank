import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Controller()
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @MessagePattern('createDebt')
  create(@Payload() createDebtDto: CreateDebtDto) {
    return this.debtService.create(createDebtDto);
  }

  @MessagePattern('findAllDebt')
  findAll() {
    return this.debtService.findAll();
  }

  @MessagePattern('findOneDebt')
  findOne(@Payload() id: string) {
    return this.debtService.findOne(id);
  }
  @MessagePattern('findAllDebtByLogin')
  findAllDebtByLogin(@Payload() accounts: string[]) {
    return this.debtService.findAllDebtByLogin(accounts);
  }

  @MessagePattern('updateDebt')
  update(@Payload() updateDebtDto: UpdateDebtDto) {
    return this.debtService.update(updateDebtDto.id, updateDebtDto);
  }

  @MessagePattern('removeDebt')
  remove(@Payload() id: string) {
    return this.debtService.remove(id);
  }
}
