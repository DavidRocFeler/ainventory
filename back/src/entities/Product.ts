import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { User } from "./User";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column()
  name: string;

  @Column()
  currentStock: number;

  @Column()
  incoming: number;

  @Column()
  consumed: number;

  @Column()
  total: number;

  @Column()
  unit: string;

  @Column()
  icon: string;

  @Column({
    type: "enum",
    enum: ["wine", "beer", "spirits", "coffee", "other"],
    default: "other",
  })
  category: 'wine' | 'beer' | 'spirits' | 'coffee' | 'other';

  // AGREGAR ESTOS DOS CAMPOS:
  @Column({ default: true })
  isGlobal: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "created_by_user_id" })
  createdBy?: User;
}