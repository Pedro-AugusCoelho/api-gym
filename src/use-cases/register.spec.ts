import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repositories'
import { UserAlreadyExistError } from './errors/user-already-exist'

describe('Register Use Case', () => {
    it('Should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new  RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'Pedro A.',
            email: 'pedro@pedro.com',
            password: '123456@'
        })

       expect(user.id).toEqual(expect.any(String))
    })
    
    it('Should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new  RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'Pedro A.',
            email: 'pedro@pedro.com',
            password: '123456@'
        })

       const isPasswordCorrectlyHashed = await compare('123456@', user.password_hash)

       expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('Should not be able to register with same email twice', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new  RegisterUseCase(usersRepository)

        const email = 'pedro@pedro.com'

        await registerUseCase.execute({
            name: 'Pedro A.',
            email,
            password: '123456@'
        })

       await expect(() => {
        return registerUseCase.execute({
            name: 'Pedro A.',
            email,
            password: '123456@'
        })
       }).rejects.toBeInstanceOf(UserAlreadyExistError)
    })
})