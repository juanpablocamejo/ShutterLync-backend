import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { PasswordTooShortError } from "../models/exceptions/PasswordTooShortError";
import { UserRole } from "../models/enums/UserRole";

const SALT_WORK_FACTOR = 10;

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async findByText(text: string, userRole?: UserRole) {
        const criteria = {
            name: text,
            lastName: text,
            email: text
        };

        return await this.userRepository.findLike(criteria);
    }

    async createPassword(user: User, password: string) {
        if (password.trim().length < 8) { throw new PasswordTooShortError(); }
        user.password = await this.hashPassword(password);
        return await this.userRepository.update(user._id, user);
    }

    private async hashPassword(password: string) {
        return await bcrypt.hash(password, SALT_WORK_FACTOR);
    }

    private async verifyPassword(user: User, password: string) {
        return await bcrypt.compare(password, user.password);
    }

    async create(user: User) {
        if (user.password) { user.password = await this.hashPassword(user.password); }
        return await this.userRepository.create(user);
    }

    async confirmUser(email: string, oldPassword: string, password: string) {
        const user: User = await this.userRepository.findOne({ email });
        if (user && (await this.verifyPassword(user, oldPassword))) {
            user.confirm(await this.hashPassword(password));
            await this.userRepository.update(user._id, user);
            return this.authenticate(email, password);
        }
        else {
            return undefined;
        }
    }

    async authenticate(email: string, password: string): Promise<User> {
        const user: User = await this.userRepository.findOne({ email });
        if (!user || !(await this.verifyPassword(user, password))) {
            return undefined;
        }
        else {
            return user;
        }
    }

}

