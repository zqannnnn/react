import { Currency } from ".";

export interface Order {
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
  fed?:string;
  grainFedDays?:number;
  brand?:string;
  factoryNum?:string;
  deliveryTerm?:string;
  placeOfOrigin?:string;
  marbleScore?:number;
  quantity?:number;
  price?:number;
  currencyId?:string;
  currency?:Currency;
  offerId?:string;
  cancelling?:boolean;
  cancellError?:string;
}