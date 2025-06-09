import { AppDataSource } from "../config/dataSource";
import { UserEntity } from "../entities/UserEntity";

export const UserRepository = AppDataSource.getRepository(UserEntity);