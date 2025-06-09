import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CredentialEntity } from "./CredentialEntity";
import { UserInventoryEntity } from "./UserInventoryEntity"; // Asegúrate de importar la entidad de inventario
import { InventoryItemsEntity } from "./InventoryItemsEntity";

export enum Role {
    ADMIN = "admin",
    USER = "user"
}

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER
    })
    role: Role;

    @OneToOne(() => CredentialEntity)
    @JoinColumn()
    credential: CredentialEntity;

    // Relación One-to-Many con UserInventoryEntity
    @OneToMany(() => UserInventoryEntity, inventory => inventory.user)
    inventories: UserInventoryEntity[];

    // ✅ Añade esta relación directa con InventoryItemsEntity (si la necesitas)
    @OneToMany(() => InventoryItemsEntity, item => item.user)
    items: InventoryItemsEntity[];
}