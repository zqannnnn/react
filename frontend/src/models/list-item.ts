import { Currency } from ".";
export interface ListItem {
    id?:string;
    itemType?:string;
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
    currencyCode?:string;
    currency?:Currency
    trimmings?:number;
    cancelling?:boolean;
    cancellError?:string;
  }