import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";
import { AuthenticationException } from "../models/exceptions/AuthenticationException";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async findByText(text: string) {
        return await this.userRepository.findLike({
            name: text,
            lastName: text,
            email: text
        });
    }
    async create(user: User) {
        return await this.userRepository.create(user);
    }

    async authenticate(email: string, password: string) {
        const result = await this.userRepository.find({ email });
        if (result.length === 0) {
            throw new AuthenticationException();
        }
    }
}