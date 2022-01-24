import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User,Owner } from "./User";

@Entity() //this class is an entity class and will be automatically created in the database when we execute the process 
export class RefreshToken{
    @PrimaryGeneratedColumn("uuid") //id generated automatically with a uuid
    id:string;
    ownerid:string;

    @ManyToOne(type => User, user => user.refreshTokens) //many refresh tokens can point to 1 user
    user:User;

    @ManyToOne(type => Owner, owner => owner.refreshTokens)
    owner:Owner;

    @Column()
    jwtId:string;

    @Column({default:false})
    used:boolean; //check if the refresh token is already being used 

    @Column({default:false})
    invalidated:boolean; //check when the user logs out we need to invalidate this refresh token

    @Column()
    expiryDate: Date; //refresh tokens need to have longer lifetime than normal JWT tokens

    //MetaDataInfo
    @CreateDateColumn() //fills automatically the below column and gives it the current date when the record was created
    creationDate:Date; 

    @UpdateDateColumn()
    updateDate:Date; //if we update the token to invalidated than the updated date will be automatically inserted


}