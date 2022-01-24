import { FoodData, RestaurantData } from "../data/response/restaurantsData";
import {FoodList, Restaurant} from "../entity/User";


export class RestaurantEntity{
    public static restaurantEntity(restaurant: Restaurant): RestaurantData{
   
        const restaurantData: RestaurantData = new RestaurantData();
        restaurantData.res_id = restaurant.res_id;
        restaurantData.restaurant_name = restaurant.restaurant_name;
        restaurantData.location = restaurant.location;
        restaurantData.opening_hour = restaurant.opening_hour;
        restaurantData.closing_hour = restaurant.closing_hour;
        return restaurantData;
        
    }
}

export class FoodListEntity{
    public static foodListEntity(foodlist: FoodList): FoodData{
   
        const foodData: FoodData = new FoodData();
        foodData.item_id = foodlist.item_id;
        foodData.item_name = foodlist.item_name;
        foodData.quantity = foodlist.quantity;
        foodData.old_price = foodlist.old_price;
        foodData.new_price = foodlist.new_price;
        foodData.restaurant_name = foodlist.restaurant_name;
        return foodData;
        
    }
}