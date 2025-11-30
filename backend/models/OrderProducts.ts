export interface OrderProductsRequest {
  id?: number;
  order_id?: string;
  product_name?: string;
  product_qty?: string;
  product_price?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
