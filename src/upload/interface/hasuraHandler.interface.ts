export interface HasuraResponse<T = any> {
  data: T;
}

export interface SatuDataInsPost {
  satu_data_ins_post: HasuraPostResponse[];
}

export interface InsertPostAndReelsImages {
  key: string;
}

export interface HasuraPostResponse {
  id: string;
  caption: string;
  thumbnail: string;
  post_images: InsertPostAndReelsImages[];
  created_at: any;
  update_at: any;
}
