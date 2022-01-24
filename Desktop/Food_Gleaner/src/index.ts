import "reflect-metadata";
import {createConnection, getConnection, getRepository} from "typeorm";
import {User, Owner, Restaurant, FoodList} from "./entity/User";
import * as express from 'express';
import{OwnerRegister, Register} from "./data/request/register"
import { Database } from "./database";
import { PasswordHash } from "./security/passwordHash";
import { Auth, Authentication } from "./data/response/authentication";
import { BusinessUserData, UserData} from "./data/response/userData";
import { JWT } from "./security/jwt";
import { Login, OwnerLogin} from "./data/request/login";
import { BusinessUserEntitytoDataTObject, UserEntitytoDataTObject } from "./utilities/userEntitytoDataTObject";
import { FoodListEntity, RestaurantEntity } from "./utilities/restaurantEntity";
import { FoodData, RestaurantData } from "./data/response/restaurantsData";


const app = express();

//The app uses express.json middleware
app.use(express.json());

//call the database
Database.initialize();


app.post("/register", async (req, resp) => {
      try {
            const body: Register = req.body;
            console.log(body);
       
            //validate the body
            if(body.password !== body.repeatPassword)
            {    throw new Error("Repeat Password Does Not Match The Password");}
            
       
            //validate if the email is already being used
            //also check if the promise of "findOne" is is set or not -> we need to await
            if( await Database.userRepository.findOne({email: body.email})){
                  throw new Error("Email is Already Being Used");
            }
       
            //store the user
            const user = new User();
            user.username = body.username;
            user.email = body.email;
            user.password = await PasswordHash.hashPassword(body.password);

            //save these info in the database
            await Database.userRepository.save(user);

            const authenticationData:Authentication = new Authentication();
            const userData: UserData = UserEntitytoDataTObject.userToDataTObject(user);

            //assign user data to authentication data
            //implement token generation and refresh tokens
            const tokenAndRefreshToken =  await JWT.generateTokenAndRefreshToken(user); //await is used since the func generateToken returns a promise
            authenticationData.user = userData;
            authenticationData.token = tokenAndRefreshToken.token;
            authenticationData.refreshToken = tokenAndRefreshToken.refreshToken;

            

             resp.json(authenticationData).status(201);
      } catch (error) {
            resp.status(500).json({
                  message: error.message
            }); //500 status: internal server error
            
      }

})

app.post("/login", async (req, resp) => {
      try {
            //check if the email/user exists or not
      const body: Login = req.body;
      const user = await Database.userRepository.findOne({email: body.email});
      if(!user){
            throw new Error("Email Does Not Exist");
      }

      //check if the password is valid 
       if(!await PasswordHash.isPasswordValid(body.password, user.password)){
            throw new Error("Invalid Password");
       }

       //retreive tokens
       const {token, refreshToken} = await JWT.generateTokenAndRefreshToken(user);
      //generate authentication/response
   
      const authenticationData = new Authentication();
      authenticationData.user = UserEntitytoDataTObject.userToDataTObject(user);
      authenticationData.token = token;
      authenticationData.refreshToken = refreshToken;

      resp.json(authenticationData).status(202);


      } catch (error) {
         resp.status(500).json({
               message:error.message, })   
      }
      
})

app.post("/OwnerRegister", async (req, resp) => {
      try {
            const body: OwnerRegister = req.body;
            console.log(body);
       
            if(body.password !== body.repeatPassword)
            {    throw new Error("Repeat Password Does Not Match The Password");}
            
       
            if( await Database.userRepository.findOne({email: body.email})){
                  throw new Error("Email is Already Being Used");
            }
       
            //store the user(restaurant owner)
            const owner = new Owner();
            owner.username = body.username;
            owner.email = body.email;
            owner.passwd = await PasswordHash.hashPassword(body.password);

            //save these info in the database
            await Database.ownerRepository.save(owner);

            const authData:Auth = new Auth();
            const businessUserData: BusinessUserData = BusinessUserEntitytoDataTObject.businessUserToDataTObject(owner);


            const tokenAndRefreshToken =  await JWT.genTokenAndRefreshToken(owner);
            authData.owner = businessUserData;
            authData.token = tokenAndRefreshToken.tok;
            authData.refreshToken = tokenAndRefreshToken.refToken;

            

             resp.json(authData).status(201);
      } catch (error) {
            resp.status(500).json({
                  message: error.message
            }); //500 status: internal server error
            
      }

})

app.post("/OwnerLogin", async (req, resp) => {
      try {
            //check if the email/user exists or not
      const body: OwnerLogin = req.body;
      const owner = await Database.ownerRepository.findOne({email: body.email});
      if(!owner){
            throw new Error("Email Does Not Exist");
      }

      //check if the password is valid 
       if(!await PasswordHash.isPasswordValid(body.password, owner.passwd)){
            throw new Error("Invalid Password");
       }

       //retreive tokens
       const {tok, refToken} = await JWT.genTokenAndRefreshToken(owner);
      //generate authentication/response
   
      const authData = new Auth();
      authData.owner = BusinessUserEntitytoDataTObject.businessUserToDataTObject(owner);
      authData.token = tok;
      authData.refreshToken = refToken;

      resp.json(authData).status(202);


      } catch (error) {
         resp.status(500).json({
               message:error.message, })   
      }
      
})

app.post("/Restaurants", async (req, resp) =>{
      
      try{
            const body: Restaurant = req.body;
            console.log(body);
            const restaurant = new Restaurant();
            restaurant.restaurant_name = body.restaurant_name;
            restaurant.location = body.location;
            restaurant.homepageLink = body.homepageLink;
            restaurant.opening_hour = body.opening_hour;
            restaurant.closing_hour = body.closing_hour;
      
            await Database.restaurantsRepository.save(restaurant);
            const restaurantData: RestaurantData = RestaurantEntity.restaurantEntity(restaurant);
            resp.status(201).json(restaurantData);
      }catch(error){
            resp.status(500).json({
                  message:error.message
            })

      }   

})


app.post("/FoodList", async (req,resp)=>{
      try{
            const body: FoodList = req.body;
            console.log(body);
            const foodlist = new FoodList();
            foodlist.item_name = body.item_name;
            foodlist.quantity = body.quantity;
            foodlist.old_price = body.old_price;
            foodlist.new_price = body.new_price;
            foodlist.restaurant_name = body.restaurant_name;
            await Database.foodlistRepository.save(foodlist);
            const foodData: FoodData = FoodListEntity.foodListEntity(foodlist);
            resp.status(201).json(foodData);
      }catch(error){
            resp.status(500).json({
                  message:error.message
            })

      }


})

app.get("/Restaurants", async (req, resp) => {
      
      try {
            const body: Restaurant = req.body;
            console.log(body);
            const restaurantsRepository = await getRepository(Restaurant)
            .createQueryBuilder("restaurantsRepository")
            .where("restaurantsRepository.location = :location", { location: body.location })
            .getMany();
            resp.status(302).send(restaurantsRepository); //status 302 means item found
      } catch (error) {
            resp.status(404).send("Location Not Found");
      }

})

app.get("/FoodList/:item_name", async (req,resp)=>{
      try {
            const body: FoodList = req.body;
            console.log(body);
            const foodlistRepository = await getRepository(FoodList)
            .createQueryBuilder("foodlistRepository")
            .where("foodlistRepository.item_name = :item_name", { item_name: body.item_name })
            .getOne();
            resp.status(302).send(foodlistRepository); //status 302 means item found
      } catch (error) {
            resp.status(404).send("This Type of Food is Not Available");
      }
})


app.put("/FoodList/:item_id", async(req,resp)=>{
      try {
            const body: FoodList = req.body;
            console.log(body);
           await getConnection()
          .createQueryBuilder()
          .update(FoodList)
          .set({item_name: body.item_name, quantity: body.quantity, old_price:body.old_price, new_price:body.new_price, restaurant_name:body.restaurant_name })
          .where("item_id = :item_id", { item_id: body.item_id})
          .execute();
          resp.sendStatus(205);
      } catch (error) {
            resp.sendStatus(304);
      }


        

})

app.put("/Restaurant/:res_id", async(req,resp)=>{
      try {
            const body: Restaurant = req.body;
            console.log(body);
           await getConnection()
          .createQueryBuilder()
          .update(Restaurant)
          .set({restaurant_name: body.restaurant_name, location: body.location, homepageLink:body.homepageLink, opening_hour:body.opening_hour, closing_hour:body.closing_hour})
          .where("res_id = :res_id", { res_id: body.res_id})
          .execute();
          resp.sendStatus(205);
      } catch (error) {
            resp.sendStatus(304);
      }
})
            
app.delete("/FoodList/:item_name",async (req,resp)=>{
      try {
            const body: FoodList = req.body;
            console.log(body);
            await getConnection()
            .createQueryBuilder()
            .delete()
            .from(FoodList)
            .where("item_id = :item_id", { item_id: body.item_id })
            .orWhere("item_name = :item_name", {item_name: body.item_name})
            .execute();
            resp.status(204);
            
      } catch (error) {
            resp.status(404).send("This Type of Food is Not Stored in Database");          
      }

})

app.delete("/Restaurant/:res_id",async (req,resp)=>{
      try {
            const body: Restaurant = req.body;
            console.log(body);
            await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Restaurant)
            .where("res_id = :res_id", { res_id: body.res_id })
            .execute();
            resp.status(204).send("Deleted Successfully");
      } catch (error) {
            resp.status(404).send("This Restaurant is Not Stored in Database");          
      }

})


app.listen(process.env.PORT || 5000, () => console.log("App is Listening on PORT ",5000));

//typeorm function that creates a connection
createConnection().then(async connection => {}).catch(error => console.log(error));