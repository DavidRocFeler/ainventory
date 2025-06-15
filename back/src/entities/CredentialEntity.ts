// src/entities/Credential.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsNotEmpty, Length, Matches } from "class-validator";

@Entity({ name: "credentials" })
export class CredentialEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  @IsNotEmpty({ message: "La contraseña no puede estar vacía" })
  @Length(8, 100, { 
    message: "La contraseña debe tener entre 8 y 100 caracteres" 
  })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/, {
    message: "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
  })
  password: string;
}