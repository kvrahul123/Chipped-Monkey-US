export interface OrderRequest {
  id?: number;
  order_id?: string;
  vendorTxCode?: string;
    user_id?: number;
  name?: string;
  email?: string;
  date?: string;
  phone_number?: number;
  address?: string;
  county?: string;
  city?: string;
  country?: string;
  pincode?: string;
  total_amount?: number;
  discount_amount?: number;
  tax_amount?: number;
  payment_status?: string;
  payment_encrypted_response?: string;
  payment_response?: string;
  payment_type?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
