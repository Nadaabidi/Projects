import { UserData, BusinessUserData } from "./userData";
export class Authentication{
    token:string;
    refreshToken:string;
    user: UserData;
}

export class Auth{
    token:string;
    refreshToken:string;
    owner: BusinessUserData;
}