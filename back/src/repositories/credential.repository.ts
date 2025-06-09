import { AppDataSource } from "../config/dataSource";
import { CredentialEntity } from "../entities/CredentialEntity";

export const CredentialRepository = AppDataSource.getRepository(CredentialEntity);