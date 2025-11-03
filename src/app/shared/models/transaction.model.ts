export interface ITransaction {
  id: number | string;
  userId: number | string;
  date: Date;
  amount: number;
  type: 'credit' | 'debit';
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

export type TTransactionType = ITransaction['type'];
export type TTransactionStatus = ITransaction['status'];