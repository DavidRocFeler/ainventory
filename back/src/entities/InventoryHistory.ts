import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique
  } from "typeorm";
  import { User } from "./User";
  import { Product } from "./Product";
  
  @Entity({ name: "inventory_history" })
  @Unique(["user", "product", "date"]) // Un registro por usuario, producto y fecha
  export class InventoryHistory {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;
  
    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;
  
    @Column({ type: "date" })
    date: Date;
  
    @Column()
    currentStock: number;
  
    @Column()
    incoming: number;
  
    @Column()
    consumed: number;
  
    @Column()
    total: number;
  
    @CreateDateColumn()
    createdAt: Date;
  }