import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repositories'
import { CheckInUseCase } from './checkin'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repositories'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        gymsRepository.items.push({
            id: 'gym-01',
            title: 'Academia Fitness',
            description: 'A melhor do bairro',
            phone: '',
            latitude: new Decimal(-23.18162),
            longitude: new Decimal(-45.868232),
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('Should be able to check in', async () => {
        const {checkIn} = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.18162,
        userLongitude: -45.868232
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('Should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2024, 4, 20, 8,0,0))
        
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.18162,
            userLongitude: -45.868232
        })
        
        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.146141,
            userLongitude: -45.910437
        })).rejects.toBeInstanceOf(Error)
    })

    it('Should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2024, 4, 20, 8,0,0))
        
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.18162,
            userLongitude: -45.868232
        })

        vi.setSystemTime(new Date(2024, 4, 21, 8,0,0))
        
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.18162,
            userLongitude: -45.868232
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('Should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Academia Fitness',
            description: 'A melhor do bairro',
            phone: '',
            latitude: new Decimal(-23.18162),
            longitude: new Decimal(-45.868232),
        })

        await expect(() => sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -23.146141,
            userLongitude: -45.910437
        })).rejects.toBeInstanceOf(Error)
    })
})

