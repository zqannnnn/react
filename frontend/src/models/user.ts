export interface UserEntity {
    id?:string;
    userName:string;
    password:string;
    email:string;
    isActive:boolean;
    resetKey?:string;
    gitlagData?:Object;
    userType?:number;
    deleting?:boolean;
    deleteError?:string;
  }