import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticationUseCase } from "../authenticate"

export function makeAuthenticateUseCase() {
    const usersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticationUseCase(usersRepository)

    return authenticateUseCase
}