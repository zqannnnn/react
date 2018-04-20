import { Currency } from ".";
export interface User {
    id?:string;
    firstName?:string;
    lastName?:string;
    password?:string;
    email?:string;
    isActive?:boolean;
    resetKey?:string;
    userType?:number;
    deleting?:boolean;
    deleteError?:string;
    preferedCurrencyId?:string;
    preferedCurrency?:Currency;
  }