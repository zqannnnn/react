export interface Order {
  id?:string;
  status?:number;
  type?:string
  storage?:string;
  breed?:string;
  grade?:string;
  slaughterSpec?:string;
  primalCut?: string;
  bone?:string;
  // hamId?: string;
  offerId?:string;
  cancelling?:boolean;
  cancellError?:string;
}