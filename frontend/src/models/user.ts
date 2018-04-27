import { Currency,Image,ListItem } from ".";

export class User implements ListItem {
    id?:string;
    itemType?:string;
    firstName?:string;
    lastName?:string;
    password?:string;
    email?:string;
    isActive?:boolean;
    resetKey?:string;
    userType?:number;
    deleting?:boolean;
    deleteError?:string;
    preferedCurrencyCode?:string;
    preferedCurrency?:Currency;
    companyName?: string
    companyAddress?: string
    businessLicenses?: Image[]
    companyInfoFilled?:boolean;
    companyConfirmed?: boolean;
  }