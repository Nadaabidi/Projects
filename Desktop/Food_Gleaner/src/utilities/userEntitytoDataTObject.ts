import { BusinessUserData, UserData } from "../data/response/userData";
import { User,Owner} from "../entity/User";

export class UserEntitytoDataTObject{
    public static userToDataTObject(user: User): UserData{
   
        const userData: UserData = new UserData();
        userData.id = user.id;
        userData.username = user.username;
        userData.email = user.email;
        return userData;
        
    }
}

export class BusinessUserEntitytoDataTObject{
    public static businessUserToDataTObject(owner: Owner): BusinessUserData{
   
        const businessUserData: BusinessUserData = new BusinessUserData();
        businessUserData.ownerid = owner.ownerid;
        businessUserData.username = owner.username;
        businessUserData.email = owner.email;
        return businessUserData;
        
    }
}