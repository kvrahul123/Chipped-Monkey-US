export interface TransactionRequest {
  id: number;
  user_id?: number | null;
  transaction_id?: string | null;
  sort_code?: string | null;
  account_number?: string | null;
  requested_amount?: string | null;
  bank_name?: string | null;
  account_holders_name?: string | null;
  status?: string | null; // you can replace with 'pending' | 'approved' | 'rejected' if needed
  created_at: string;
  updated_at: string;
}
