import { PubSub } from 'graphql-subscriptions'
import { PrismaClient, Prisma } from '@prisma/client'

export interface Context {
    prisma: PrismaClient,
    pubsub: PubSub
}

const prisma = new PrismaClient()
const pubsub = new PubSub()

export const context: Context = {
    prisma, pubsub
}