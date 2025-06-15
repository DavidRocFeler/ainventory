import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { UserEntity } from "./UserEntity";
import { InventoryItemsEntity } from "./InventoryItemsEntity";

@Entity({ name: "products" })
export class ProductEntity {
  @PrimaryGeneratedColumn({ name: "product_id" })
  product_id: number;

  @Column()
  name: string;

  @Column()
  unit: string;

  @Column()
  icon: string;

  @Column({
    type: "enum",
    enum: ["wine", "beer", "liqueur", "soda", "water", "drinks-o", "drinks", 'others'],
    default: "others"
  })
  category: 'wine' | 'beer' | 'liqueur' | 'soda' | 'water' | 'drinks-o' | 'drinks' | 'others';

  @Column({ name: "is_global", type: "boolean", default: true })
  is_global: boolean;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: UserEntity; // Nombre más simple (como en el diagrama)

  @OneToMany(() => InventoryItemsEntity, item => item.product)
  inventoryItems: InventoryItemsEntity[];
}
