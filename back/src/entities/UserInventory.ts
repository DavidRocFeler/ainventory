import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Unique
  } from "typeorm";
  import { User } from "./User";
  import { Product } from "./Product";
  
  @Entity({ name: "user_inventory" })
  @Unique(["user", "product"]) // Un usuario solo puede tener un registro por producto
  export class UserInventory {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;
  
    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;
  
    @Column({ default: 0 })
    currentStock: number;
  
    @Column({ default: 0 })
    incoming: number;
  
    @Column({ default: 0 })
    consumed: number;
  
    @Column({ default: 0 })
    total: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }