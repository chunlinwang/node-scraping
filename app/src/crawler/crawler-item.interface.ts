export interface CrawlerItem {
  // [key:string]: any
  title: string;
  url: string;
  brand: string;
  productName: string;
  originPrice?: number;
  salePrice: number;
  currency: string;
  source: string;
  scanDate: Date;
}
