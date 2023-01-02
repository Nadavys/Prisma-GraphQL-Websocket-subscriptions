import { context } from './context';
import {
    makeSchema,
    objectType,
    stringArg,
    intArg,
    nonNull,
    queryType,
    asNexusMethod,
    subscriptionType,
    mutationType
} from 'nexus';
import { DateTimeResolver } from 'graphql-scalars';
export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('name')

    },
})

const Message = objectType({
    name: "Message",
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('title')
        t.nonNull.string('body')
        t.nonNull.field('createdAt', { type: 'DateTime' })
        t.nonNull.field('user', {
            type: "User",
            resolve: (parent, __, context) => {
                return context.prisma.message.findUnique({ where: { id: parent?.id } }).user()
            }
        })
    },
})

const MessageFeed = objectType({
    name: "MessageFeed",
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('name')

        t.nonNull.list.field('messages',
            {
                type: "Message",
                resolve: (parent, _, context) => {
                    return context.prisma.messageFeed.findUnique({ where: { id: parent?.id } }).messages()
                }

            })
    },
})

export const Query = queryType({
    definition(t) {
        t.nonNull.list.field('allUsers', {
            type: "User",
            resolve: (parent, args, context) => {
                return context.prisma.user.findMany()
            }
        });

        t.nonNull.list.field('allMessageFeeds', {
            type: "MessageFeed",
            resolve: (parent, _, context) => {
                return context.prisma.messageFeed.findMany()
            }
        })

        t.nonNull.list.field('allMessages', {
            type: "Message",
            resolve: (parent, _, context) => {
                return context.prisma.message.findMany()
            }
        })
    },
})

export const Mutation = mutationType({
    definition(t) {
        t.field('createMessage', {
            type: "Message",
            args: {
                title: stringArg(),
                body: stringArg(),
                user: stringArg(),
                feed: stringArg()
            },
            resolve: async (_, {title, body, user:userName, feed: feedName}, context) => {
                const newMessage = await context.prisma.message.create({
                    data: {
                        title,
                        body,
                        user:{connect:{name:userName}},
                        feed:{connect:{name:feedName}}
                    }
                })

                context.pubsub.publish('newMessage', newMessage);
                return newMessage;
            }
        })
    },
})


const Subscription = subscriptionType({
    definition(t) {
        t.nonNull.field('newMessage',{
            type:"Message",
            subscribe(root, args, context, info) {
                console.log({info});
                return context.pubsub.asyncIterator('newMessage')
            },
            resolve(root, args, context, info) {
                console.log({root})
                return root
            },
        })
    },
})

export const schema = makeSchema({
    contextType: { module: require.resolve('./context'), export: "Context" },
    types: [DateTime, Query, Mutation, Subscription, User, MessageFeed, Message],
    outputs: {
        schema: __dirname + "/../schema.graphql",
        typegen: __dirname + '/generated/nexus.ts',
    },
    sourceTypes: {
        modules: [
            {
                module: "@prisma/client",
                alias: "prisma"
            }
        ]
    }
})
