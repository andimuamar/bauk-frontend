/** Minimal shape of the standard WordPress REST API v2 resources we use. */

interface RenderedField {
  rendered: string;
}

interface WPMediaSize {
  source_url: string;
  width: number;
  height: number;
}

interface WPMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: {
      thumbnail?: WPMediaSize;
      medium?: WPMediaSize;
      medium_large?: WPMediaSize;
      large?: WPMediaSize;
      full?: WPMediaSize;
      [key: string]: WPMediaSize | undefined;
    };
  };
}

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: RenderedField;
  excerpt: RenderedField;
  content?: RenderedField;

  categories: number[];
  featured_media: number;

  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
  };

  _thumbnail?: WPMedia | null;
}

export interface WPPage {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: RenderedField;
  excerpt: RenderedField;
  content?: RenderedField;
  parent: number;
  menu_order: number;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  link: string;
  parent: number;
}
