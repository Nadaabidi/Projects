import { Connection, Repository, createConnection} from "typeorm";
import { RefreshToken } from "./entity/RefreshToken";
import {User,Owner, Restaurant, FoodList} from "./entity/User";


export class Database{
    public static connection: Connection;
    public static userRepository: Repository<User>;
    public static ownerRepository: Repository<Owner>;
    public static refreshTokenRepository: Repository<RefreshToken>;
    public static restaurantsRepository: Repository<Restaurant>;
    public static foodlistRepository: Repository<FoodList>;

    public static async initialize() {
        this.connection = await createConnection();
        this.userRepository = this.connection.getRepository(User);
        this.ownerRepository = this.connection.getRepository(Owner);
        this.refreshTokenRepository = this.connection.getRepository(RefreshToken);
        this.restaurantsRepository = this.connection.getRepository(Restaurant);
        this.foodlistRepository = this.connection.getRepository(FoodList);}

}

