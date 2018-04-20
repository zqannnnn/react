import { Currency } from ".";
export interface Offer {
  id?:string;
  userId?:string;
  status?:number;
  type?:string
  storage?:string;
  breed?:string;
  grade?:string;
  slaughterSpec?:string;
  primalCuts?: string;
  bone?:string;
  title?:string;
  desc?:string;
  fed?:string;
  grainFedDays?:number;
  brand?:string;
  factoryNum?:string;
  deliveryTerm?:string;
  placeOfOrigin?:string;
  marbleScore?:number;
  quantity?:number;
  price?:number;
  currency?:Currency;
  currencyCode?:string;
  trimmings?:number;
  images?:Image[];
  cancelling?:boolean;
  cancellError?:string;
}
export interface Image{
  path:string
}