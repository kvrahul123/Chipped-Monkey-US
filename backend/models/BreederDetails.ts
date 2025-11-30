export interface BreederDetailRequest {
  id?: number;
  implanter_type?: string;
  user_id?: string;
  implanter_pin?: string;
  breeder_licence_no?: string;
  breeder_local_authority?: string;
  dealer_licence_no?: string;
  dealer_local_authority?: string;
  local_authority?: string;
  status?: 'active' | 'inactive';
  created_at?: Date;
  updated_at?: Date;
}
