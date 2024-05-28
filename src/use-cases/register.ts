import { UserRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistError } from "./errors/user-already-exist"
import { User } from "@prisma/client"

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor (private usersRepository: UserRepository) {}

    async execute ({email, name, password}:RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6)
    
        const userWithSameEmail = await this.usersRepository.findByEmail(email)
    
        if (userWithSameEmail) {
           throw new UserAlreadyExistError()
        }
    
        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        })

        return {
            user,
        }
    }
}
