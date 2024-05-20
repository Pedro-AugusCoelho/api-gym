import fastify from "fastify";
import { PrismaClient } from '@prisma/client'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Pedro Augusto C. Costa',
    email: 'pedro@gmail.com.br',
  },
})