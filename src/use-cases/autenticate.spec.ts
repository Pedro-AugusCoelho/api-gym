import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repositories'
import { AuthenticationUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticationUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticationUseCase(usersRepository)
    })

    it('Should be able to authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new  AuthenticationUseCase(usersRepository)

        await usersRepository.create({
            name: 'Pedro A.',
            email: 'pedro@pedro.com',
            password_hash: await hash('123456@', 6)
        })

        const { user } = await sut.execute({
            email: 'pedro@pedro.com',
            password: '123456@'
        })

       expect(user.id).toEqual(expect.any(String))
    })

    it('Should not be able to authenticate with wrong email', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new  AuthenticationUseCase(usersRepository)

        await usersRepository.create({
            name: 'Pedro A.',
            email: 'pedro@pedro.com',
            password_hash: await hash('123456@', 6)
        })

        await expect(() => {
            return sut.execute({
                email: 'pedro@pedro.com',
                password: '123456'
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)

    })
})