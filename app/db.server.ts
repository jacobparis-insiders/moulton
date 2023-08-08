import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

prisma.$connect()
