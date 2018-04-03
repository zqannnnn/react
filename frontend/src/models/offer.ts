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
  images?:Image[];
  cancelling?:boolean;
  cancellError?:string;
}
export interface Image{
  path:string
}