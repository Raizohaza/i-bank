import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ConfigService } from './config/config.service';
import { ICustomer } from '../interfaces/customer.interface';
import { ICustomerLink } from '../interfaces/customer-link.interface';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private readonly customerModel: Model<ICustomer>,
    @InjectModel('CustomerLink')
    private readonly customerLinkModel: Model<ICustomerLink>,
    private readonly configService: ConfigService
  ) {}

  public async searchCustomer(params: { email: string }): Promise<ICustomer[]> {
    return this.customerModel.find(params).exec();
  }
  async findAllCustomer() {
    return await this.customerModel.find();
  }
  public async searchCustomerById(id: string): Promise<ICustomer> {
    return this.customerModel.findById(id).exec();
  }

  public async updateCustomerById(
    id: string,
    customerParams: { is_confirmed: boolean }
  ): Promise<ICustomer | unknown> {
    return this.customerModel.updateOne({ _id: id }, customerParams).exec();
  }

  public async createCustomer(customer: ICustomer): Promise<ICustomer> {
    const customerModel = new this.customerModel(customer);
    return await customerModel.save();
  }

  public async createCustomerLink(id: string): Promise<ICustomerLink> {
    const customerLinkModel = new this.customerLinkModel({
      customer_id: id,
    });
    return await customerLinkModel.save();
  }

  public async getCustomerLink(link: string): Promise<ICustomerLink[]> {
    return this.customerLinkModel.find({ link, is_used: false }).exec();
  }

  public async updateCustomerLinkById(
    id: string,
    linkParams: { is_used: boolean }
  ): Promise<ICustomerLink | unknown> {
    return this.customerLinkModel.updateOne({ _id: id }, linkParams);
  }

  public getConfirmationLink(link: string): string {
    return `${this.configService.get('baseUri')}:${this.configService.get(
      'gatewayPort'
    )}/customers/confirm/${link}`;
  }
}
