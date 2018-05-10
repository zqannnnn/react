import { Currency,ListItem,Image } from ".";

export class Offer implements ListItem{
  id?:string;
  userId?:string;
  status?:number;
  itemType?:string;
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
  certificates?:Image[];
  cancelling?:boolean;
  cancellError?:string;
}
