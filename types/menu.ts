export interface MenuItem {
  id: number;
  parent: number;
  title: string;
  url: string;
  target: string;
  classes: string[];
  description: string;
  object: string;
  object_id: number;
  order: number;
  children: MenuItem[];
}

export interface MenuResponse {
  id: number;
  name: string;
  slug: string;
  count: number;
  items: MenuItem[];
}
