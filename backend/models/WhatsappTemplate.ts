export interface WhatsappTemplateRequest {
  id?: number; // auto increment
  msg_type: string;
  message: string;
  status?: string;
  label?: string;
  created_at?: string;
  updated_at?: string;
}
