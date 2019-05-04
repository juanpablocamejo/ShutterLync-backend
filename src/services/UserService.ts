import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(user: User) {
        return await this.userRepository.create(user);
    }

    async authenticate(email: string, password: string) {
        return await this.userRepository.findOne();
    }
}