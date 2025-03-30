import { AppDataSource } from "./database";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

export const userRepository = AppDataSource.getRepository(User);

export const createUser = async (username: string, email: string, password: string): Promise<User> => {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    await user.hashPassword();
    return await AppDataSource.getRepository(User).save(user);
};

export const findByEmail = async (email: string): Promise<User | null> => {
    return await AppDataSource.getRepository(User).findOne({ where: { email } });
};

export const findById = async (id: number): Promise<User | null> => {
    return await userRepository.findOne({ where: { id } });
};

export const deleteUser = async (email: string): Promise<void> => {
    await userRepository.delete({ email });
}; 

export const listUsers = async (): Promise<User[]> => {
    return await userRepository.find();
};
