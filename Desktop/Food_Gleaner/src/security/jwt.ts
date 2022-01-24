import * as jwt from "jsonwebtoken";
import { User, Owner} from "../entity/User";
import { v4 as uuidv4 } from "uuid";
import { RefreshToken } from "../entity/RefreshToken";
import * as moment from "moment";
import { Database } from "../database";
export class JWT{
 
    private static JWT_SECRET="123456"; //instance member

    public static async generateTokenAndRefreshToken(user : User)
    {
        //specify a payload that holds the user's id (and) email
        const payload = {
            id: user.id,
            email: user.email
        }    

        //specify a secret key for jwt generation to check if that token is really true by creating a new instance member of this class that holds the secret key of the jwt
  
        const jwtId = uuidv4();
        const token = jwt.sign(payload, this.JWT_SECRET, {
            expiresIn:"1h", //specify when does the token expires
            jwtid: jwtId, //returns id of the unique jsonwebtoken using uuid package as a string
                    //specify jwtid (an id of that token) -> needed for linking a refresh token, as a refresh token only points to one single unique token
 
            subject:user.id.toString() //user's id
        });

        //create a refresh token

        const refreshToken = await this.generateRefreshTokenForUserAndToken(user,jwtId);

        //link that token with the refresh token
        return {token, refreshToken};}

        private static async generateRefreshTokenForUserAndToken(user: User, jwtId:string) //the json webtoken id of this token
        {
            //create a new record of refresh token
            const refreshToken = new RefreshToken();
            refreshToken.user = user;
            refreshToken.jwtId = jwtId;
            refreshToken.expiryDate = moment().add(10,"d").toDate(); //define when this refresh token expires using moment.js package for date & time operations

            //set the expiry date of the refresh token


            //store this refresh token
            await Database.refreshTokenRepository.save(refreshToken);

            return refreshToken.id;
        }



        public static async genTokenAndRefreshToken(owner : Owner)
    {
        const payload = {
            id: owner.ownerid,
            email: owner.email
        }    
  
        const jwtId = uuidv4();
        const tok = jwt.sign(payload, this.JWT_SECRET, {
            expiresIn:"1h", //specify when does the token expires
            jwtid: jwtId, //returns id of the unique jsonwebtoken using uuid package as a string
                    //specify jwtid (an id of that token) -> needed for linking a refresh token, as a refresh token only points to one single unique token
 
            subject:owner.ownerid.toString() //user's id
        });

        //create a refresh token

        const refToken = await this.generateRefreshTokenForOwnerAndToken(owner,jwtId);

        //link that token with the refresh token
        return {tok, refToken};}

        private static async generateRefreshTokenForOwnerAndToken(owner: Owner, jwtId:string)
        {
           
            const refToken = new RefreshToken();
            refToken.owner = owner;
            refToken.jwtId = jwtId;
            refToken.expiryDate = moment().add(10,"d").toDate(); //define when this refresh token expires using moment.js package for date & time operations

            await Database.refreshTokenRepository.save(refToken);

            return refToken.id;

        }








        }



 
 
    

