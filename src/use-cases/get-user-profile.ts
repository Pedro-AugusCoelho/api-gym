import { UserRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundExist } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
    userId: string
}

interface GetUserProfileUseCaseResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor (
        private usersRepository: UserRepository,
    ) {}

    async execute({userId}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundExist()
        }

        return {
            user,
        }
    }
}