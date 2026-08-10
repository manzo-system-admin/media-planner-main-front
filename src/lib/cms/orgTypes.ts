import type { ClientCategory } from "./clientCategories";

export type TeamGalleryDoc = {
  id: string;
  image: string;
  caption?: string;
  order?: number;
  deleted?: boolean;
};

export type ClientDoc = {
  id: string;
  name: string;
  category?: ClientCategory;
  logoUrl?: string;
  order?: number;
  deleted?: boolean;
};
