export interface MicrochipPaymentRequest {
  order_id?: string;
  vendor_id?: string;
  user_id?: number;
  payment_type?: string;
  payment_response?: string;
  payment_encrypted_response?: string;
  date?: string;
  total_amount?: number;
  payment_status?: string;
  package_id?: number;
  status?: string;
}
