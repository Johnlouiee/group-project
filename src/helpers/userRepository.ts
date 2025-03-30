import { AppDataSource } from "./database";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (
    title: string,
    firstName: string,
    lastName: string,
    role: string,
    email: string,
    password: string
): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
        title,
        firstName,
        lastName,
        role,
        email,
        password: hashedPassword
    });
    return await userRepository.save(user);
};

export const findByEmail = async (email: string): Promise<User | null> => {
    return await userRepository.findOne({ where: { email } });
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

