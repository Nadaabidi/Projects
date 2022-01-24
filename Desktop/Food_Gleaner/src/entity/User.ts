import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { RefreshToken } from "./RefreshToken";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email:string;


    @Column()
    password:string;
    @OneToMany(type => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken;

}

@Entity()
export class Owner {

    @PrimaryGeneratedColumn()
    ownerid: number;

    @Column()
    username: string;

    @Column()
    email:string;


    @Column()
    passwd:string;
    
    @OneToMany(type => RefreshToken, refToken => refToken.owner)
    refreshTokens: RefreshToken;

}



@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    res_id: number;

    @Column()
    restaurant_name: string;

    @Column()
    location:string;

    @Column()
    homepageLink:string;

    @Column()
    opening_hour:string;
    
    @Column()
    closing_hour:string;

    @ManyToMany(()=> FoodList)
    @JoinTable()
    foodlist: FoodList[];
    cascade:true;
}


@Entity()
export class FoodList {

    @PrimaryGeneratedColumn()
    item_id: number;

    @Column()
    item_name: string;

    @Column()
    quantity:number;

    @Column()
    old_price:string;

    @Column()
    new_price:string;

    @Column()
    restaurant_name:string;

}
