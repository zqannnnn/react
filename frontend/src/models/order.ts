export interface Order {
  id?:string;
  userId?:string;
  status?:number;
  type?:string
  storage?:string;
  breed?:string;
  grade?:string;
  slaughterSpec?:string;
  primalCut?: string;
  bone?:string;
  price?:number;
  offerId?:string;
  cancelling?:boolean;
  cancellError?:string;
}