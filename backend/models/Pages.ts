export interface PagesRequest {
  id?: number;
  type?: string;
  title?: string;
  slug?: string;
    content?: string;
    faq_content?:string,
    meta_title?: string;
    meta_description?: string;
    keywords?: string;
  meta_image?: string;
  status?: string;
  created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}
