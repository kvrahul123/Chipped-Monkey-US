export type OrderStatus = 'pending' | 'cancelled' | 'completed';

export interface MicrochipOrdersRequest {
  id?: number;
  order_id?: string;
  user_id?: number;
  microchip_count?: number;
  date?: string; // YYYY-MM-DD
  status?: OrderStatus;
  created_at?: Date;
  updated_at?: Date;
}
