export interface ProductRequest {
  id?: number;
  title?: string;
  slug: string;
  description?: string;
  price?: number;
  image?: string;
  meta_title?: string;
  specifications?: string;
  meta_description?: string;
  meta_img?: string;
  meta_keywords?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
