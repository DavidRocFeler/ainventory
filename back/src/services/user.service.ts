import LoginUserDto from "../dtos/loginUser.dto";
import RegisterUserDto from "../dtos/registerUser.dto";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/user.repository";
import { ClientError } from "../utils/errors";
import {
  checkPasswordService,
  createCredentialService,
} from "./credential.service";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envs";

export const checkUserExists = async (email: string): Promise<boolean> => {
  const user = await UserRepository.findOneBy({ email });
  return !!user;
};

export const registerUserService = async (
  registerUserDto: RegisterUserDto
): Promise<User> => {
  const user = await UserRepository.create(registerUserDto);
  await UserRepository.save(user);
  const credential = await createCredentialService({
    password: registerUserDto.password,
  });
  user.credential = credential;
  await UserRepository.save(user);
  return user;
};

export const loginUserService = async (
  loginUserDto: LoginUserDto
): Promise<{ token: string; user: User }> => {
  console.log("🔍 Email recibido:", loginUserDto.email);
  console.log("🔍 Password recibido:", loginUserDto.password);
  
  const user: User | null = await UserRepository.findOne({
    where: {
      email: loginUserDto.email,
    },
    relations: ["credential"],
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      phone: true,
      role: true,
      credential: {           // ✅ AGREGA ESTO
        id: true,
        password: true        // ✅ Incluir explícitamente el password
      }
    }
  });
  
  console.log("🔍 Usuario encontrado:", !!user);
  console.log("🔍 Credencial existe:", !!user?.credential);
  console.log("🔍 Password hash existe:", !!user?.credential?.password);
  
  if (!user) throw new Error("User not found");
  if (!user.credential) throw new Error("Credential not found");
  if (!user.credential.password) throw new Error("Password hash not found");
  
  const isPasswordValid = await checkPasswordService(loginUserDto.password, user.credential.password);
  console.log("🔍 ¿Password válido?:", isPasswordValid);
  
  if (isPasswordValid) {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    // ✅ Eliminar credential antes de devolver
    const { credential, ...userWithoutCredential } = user;
    
    return { 
      user: userWithoutCredential as User, 
      token 
    };
  } else {
    throw new ClientError("Invalid password");
  }
};