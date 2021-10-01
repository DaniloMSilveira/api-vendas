import AppError from '@shared/errors/AppError'
import { inject } from 'tsyringe'
import { ICustomer } from '../domain/models/ICustomer'
import { IUpdateCustomer } from '../domain/models/IUpdateCustomer'
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository'

class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<ICustomer> {
    const customer = await this.customersRepository.findById(id)

    if (!customer) {
      throw new AppError('Customer not found')
    }

    const customerExists = await this.customersRepository.findByEmail(email)

    if (customerExists && email !== customer.email) {
      throw new AppError('There is already one customer with this email.')
    }

    customer.name = name
    customer.email = email

    await this.customersRepository.save(customer)

    return customer
  }
}

export default UpdateCustomerService
