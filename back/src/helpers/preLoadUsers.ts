// src/helpers/preLoadUsers.ts
import { UserEntity } from "../entities/UserEntity";
import { CredentialEntity } from "../entities/CredentialEntity";
import { AppDataSource } from "../config/dataSource";
import bcrypt from "bcrypt";
import { Role } from "../entities/UserEntity"; // Importa el enum Role desde tu entidad

interface IPreLoadUser {
    name: string;
    email: string;
    address: string;
    phone: string;
    role: Role;
    password: string; // Para la credencial
}

const usersToPreLoad: IPreLoadUser[] = [
    {
        name: "Usuario de Prueba",
        email: "test@gmail.com",
        address: "Calle Falsa 123",
        phone: "1234567890",
        role: Role.USER,
        password: "Password123!"
    },
    {
        name: "Admin",
        email: "casasarda@admin.com",
        address: "Epe",
        phone: "0987654321",
        role: Role.ADMIN,
        password: "CasaSarda123!"
    }
];

export const preLoadUsers = async () => {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const credentialRepository = AppDataSource.getRepository(CredentialEntity);
    
    const existingUsers = await userRepository.find({ relations: ["credential"] });
    
    // Solo precargar usuarios si no hay ninguno en la base de datos
    if (existingUsers.length === 0) {
        console.log("⏳ Preloading users...");
        
        for (const userData of usersToPreLoad) {
            // Crear la credencial primero
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const credential = credentialRepository.create({
                password: hashedPassword,
                // Agrega otros campos necesarios de Credential
            });
            await credentialRepository.save(credential);
            
            // Crear el usuario con la credencial
            const user = userRepository.create({
                username: userData.name,
                email: userData.email,
                address: userData.address,
                phone: userData.phone,
                role: userData.role,
                credential: credential
            });
            
            await userRepository.save(user);
            console.log(`✅ User ${user.email} preloaded`);
        }
        
        console.log("🎉 Users preloading completed");
    } else {
        console.log("ℹ️ Users already exist in database, skipping preload");
    }
};