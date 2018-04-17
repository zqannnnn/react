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
  images?:Image[];
  cancelling?:boolean;
  cancellError?:string;
}
export interface Image{
  path:string
}