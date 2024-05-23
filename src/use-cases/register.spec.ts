import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repositories'
import { UserAlreadyExistError } from './errors/user-already-exist'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new  RegisterUseCase(usersRepository)
    })

    it('Should be able to register', async () => {
        const { user } = await sut.execute({
            name: 'Pedro A.',
            email: 'pedro@pedro.com',
            password: '123456@'
        })

       expect(user.id).toEqual(expect.any(String))
    })
    
    it('Should hash user password upon registration', async () => {
        const { user } = await sut.execute({
            name: 'Pedro A.',
            email: 'pedro@pedro.com',
            password: '123456@'
        })

       const isPasswordCorrectlyHashed = await compare('123456@', user.password_hash)

       expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('Should not be able to register with same email twice', async () => {
        const email = 'pedro@pedro.com'

        await sut.execute({
            name: 'Pedro A.',
            email,
            password: '123456@'
        })

       await expect(() => {
        return sut.execute({
            name: 'Pedro A.',
            email,
            password: '123456@'
        })
       }).rejects.toBeInstanceOf(UserAlreadyExistError)
    })
})