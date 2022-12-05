export interface IProduct {
  productId: string;
  name: string;
  manufacturer: string;
  width?: number;
  height?: number;
  depth?: number;
  image?: string;
  country_of_origin?: string;
}
