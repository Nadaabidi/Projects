export class Restaurant{
    restaurant_name: string;
    location:string;
    homepageLink:string;
    opening_hour:string;
    closing_hour:string;
}

export class FoodList{
    item_id:number;
    item_name:string;
    quantity:number;
    old_price:string;
    new_price:string;
    restaurant_name:string;
}