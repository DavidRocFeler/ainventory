import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";
import { InventoryItemsEntity } from "./InventoryItemsEntity";

@Entity({ name: "user_inventory" })
export class UserInventoryEntity {
  @PrimaryGeneratedColumn({ name: "invent_id" })
  inventory_id: number;

  // Relación Many-to-One con User (un usuario tiene un inventario)
  @ManyToOne(() => UserEntity, user => user.inventories)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  // Relación One-to-Many con InventoryItems (un inventario tiene muchos ítems)
  @OneToMany(() => InventoryItemsEntity, item => item.inventory)
  items: InventoryItemsEntity[];

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}