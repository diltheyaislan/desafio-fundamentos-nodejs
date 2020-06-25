import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const request = { title, value, type };

    Object.entries(request).forEach(([key, val]) => {
      if (!val) {
        throw Error(`${key} is required`);
      }

      if (key === 'value' && val < 0) {
        throw Error('value must be greater than zero');
      }

      if (key === 'type' && !['income', 'outcome'].includes(val.toString())) {
        throw Error('type value must be income or outcome');
      }
    });

    if (type === 'outcome') {
      const balance = this.transactionsRepository.getBalance();
      if (balance.total - value < 0) {
        throw Error('outcome value must be less than balance');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
