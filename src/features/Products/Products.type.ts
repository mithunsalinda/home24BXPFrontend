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
