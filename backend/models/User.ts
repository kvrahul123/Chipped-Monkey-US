export interface RegisterUserRequest {
  id?: number; // auto increment
  name: string;
  email: string;
  type?: string;
  company_name?: string;
  company_logo?: string;
  account_type?: string;
  phone?: string;
  otp?: string;
  is_sent_otp?: string; // can be "true"/"false"
  slug?: string;
  email_verified_at?: string;
  title?: string;
  surf_name?: string;
  emergency_number?: string;
  date_of_birth?: string;
  address_1?: string;
  address_2?: string;
  address_3?: string;
  company_address?: string;
  small_description?: string;
  city?: string;
  county?: string;
  country?: string;
  postcode?: string;
  password: string;
  status?: string;
  encrypt_password?: string;
  remember_token?: string;
  created_at?: string;
  updated_at?: string;
}
