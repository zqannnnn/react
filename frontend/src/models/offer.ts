
export interface Offer {
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
  hamId?: string;
  images?:Image[];
  cancelling?:boolean;
  cancellError?:string;
}
export interface Image{
  path:string
}