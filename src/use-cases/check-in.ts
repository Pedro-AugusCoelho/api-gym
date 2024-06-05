import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundExist } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-between-coordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

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

    async execute({userId, gymId, userLatitude, userLongitude}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

        const gym = await this.gymRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundExist()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude:userLatitude, longitude: userLongitude },
            { latitude:gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new MaxDistanceError()
        }
        
        const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(userId, new Date())

        if (checkInOnSameDay) {
            throw new MaxNumberOfCheckInsError()
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