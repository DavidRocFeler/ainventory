import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { ProductEntity } from "./ProductEntity";
  import { UserInventoryEntity } from "./UserInventoryEntity";
  import { InventoryHistoryEntity } from "./InventoryHistoryEntity";
import { UserEntity } from "./UserEntity";
  
  @Entity({ name: "inventory_items" })
  export class InventoryItemsEntity {
    @PrimaryGeneratedColumn({ name: "item_id" })
    item_id: number;
  
    // Relación Many-to-One con Inventory (un inventory tiene muchos items)
    @ManyToOne(() => UserInventoryEntity, inventory => inventory.items)
    @JoinColumn({ name: "inventory_id" })
    inventory: UserInventoryEntity;

    @ManyToOne(() => UserEntity, user => user.items)
    @JoinColumn({ name: "user_id" })
    user: UserEntity;
  
    // Relación Many-to-One con Product (producto global)
    @ManyToOne(() => ProductEntity, product => product.inventoryItems)
    @JoinColumn({ name: "product_id" })
    product: ProductEntity;
  
    @Column({ type: "int", default: 0 })
    instock: number; // Cantidad actual en stock
  
    @Column({ type: "int", default: 0 })
    incoming: number; // Cantidad pendiente por llegar
  
    @Column({ type: "int", default: 0 })
    consumed: number; // Cantidad consumida
  
    @Column({ type: "int", default: 0 })
    total: number; // Total (instock + incoming - consumed)
  
    @UpdateDateColumn({ name: "update_at", type: "timestamp" })
    updated_at: Date; // Fecha de última actualización
  
    // Relación One-to-Many con History (cada item tiene su historial)
    @OneToMany(() => InventoryHistoryEntity, history => history.item)
    history: InventoryHistoryEntity[];
  }