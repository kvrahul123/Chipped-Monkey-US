export interface MicrochipPaymentDetailsRequest {
  microchip_order_id?: string;
  microchip_id?: string;
  amount?: number;
  package_id?: number;
  status?: string;
}
