export interface BlogsRequest {
  id?: number;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  image?: string;
  meta_title?: string;
  meta_img?: string;
  meta_description?: string;
  meta_keywords?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
