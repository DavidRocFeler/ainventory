import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { InventoryItemsEntity } from "./InventoryItemsEntity";

@Entity({ name: "inventory_history" })
export class InventoryHistoryEntity {
  @PrimaryGeneratedColumn({ name: "history_id" })
  history_id: number;

  // Relación Many-to-One con InventoryItemsEntity (historial pertenece a un ítem)
  @ManyToOne(() => InventoryItemsEntity, item => item.history)
  @JoinColumn({ name: "item_id" })
  item: InventoryItemsEntity;

  @Column({ name: "record_date", type: "timestamp" })
  record_date: Date;

  @Column({ type: "int" })
  instock: number; // Cantidad en stock en ese momento

  @Column({ type: "int" })
  incoming: number; // Cantidad pendiente en ese momento

  @Column({ type: "int" })
  consumed: number; // Cantidad consumida en ese momento

  @Column({ type: "int" })
  total: number; // Total calculado (instock + incoming - consumed)

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at: Date; // Fecha de creación del registro histórico
}