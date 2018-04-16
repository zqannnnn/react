export interface Category {
  id?:string;
  type:string;
  details:Details;
}
export interface Details{
  "Storage":Array < string >;
  "Breed":Array < string >;
  "Grade":Array < string >;
  "Slaughter Specification":Array < string >;
  "Bone":Array < string >
  "Marble Score":Array < string >
}