export interface User {
    id?:string;
    userName:string;
    password:string;
    email:string;
    isActive:boolean;
    resetKey?:string;
    userType?:number;
    deleting?:boolean;
    deleteError?:string;
  }