export interface ProductDetailProps {
  name: string;
  category: string;
  description: string;
  price: number;
  lastModified: string;
  picture: string[];
}
export interface Product {
  name: string;
  category: string;
  description: string;
  price: number;
  lastModified: string;
  picture: string[];
  data: ProductDetailProps;
  isLoading: boolean;
  isError: boolean;
}
export interface DataSourceItem {
  key: string | number;
  name: string;
  category: string;
  description: string;
  price: number;
  lastModified: string;
  picture: string[];
  parent_id: string;
  isModified?: boolean;
}
export interface DataSourceItemList {
  data: any;
}
