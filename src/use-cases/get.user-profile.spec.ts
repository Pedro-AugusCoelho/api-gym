import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repositories'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundExist } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it('Should be able to get user profile', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new  GetUserProfileUseCase(usersRepository)

        const createdUser = await usersRepository.create({
            name: 'Pedro A.',
            email: 'pedro@pedro.com',
            password_hash: await hash('123456@', 6)
        })

        const {user} = await sut.execute({
           userId: createdUser.id
        })

       expect(user.id).toEqual(expect.any(String))
       expect(user.name).toEqual('Pedro A.')
    })

    it('Should not be able to get user profile with wrong id', async () => {
        
        await expect(() => {
            return sut.execute({
                userId: 'non-existing-id'
            })
        }).rejects.toBeInstanceOf(ResourceNotFoundExist)

    })
})