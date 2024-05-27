import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundExist } from "./errors/resource-not-found-error";

interface CheckInUseCaseRequest {
   userId: string
   gymId: string
   userLatitude: number
   userLongitude: number
}

interface CheckInUseCaseResponse {
   checkIn: CheckIn
}

export class CheckInUseCase {
    constructor (
        private checkInRepository: CheckInsRepository,
        private gymRepository: GymsRepository
    ) {}

    async execute({userId, gymId}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

        const gym = await this.gymRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundExist()
        }

        // calcular
        
        const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(userId, new Date())

        if (checkInOnSameDay) {
            throw new Error()
        }

        const checkIn = await this.checkInRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn,
        }
    }
}