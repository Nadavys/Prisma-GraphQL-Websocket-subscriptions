import { ApolloServer } from 'apollo-server-express'
import { schema } from './schema'
import { context } from './context'
import { createServer } from 'http'
import app from './app'

import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

const PORT = process.env.PORT || 4000

const httpServer = createServer(app);

async function startServer() {
    const webSocketServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql'
    })

    const serverCleanup = useServer(
        {
            schema,
            context,
        },
        webSocketServer,
    )

    const server = new ApolloServer({
        schema,
        context
    })

    await server.start()
    server.applyMiddleware({ app })

    httpServer.listen(4000, () => {
        console.log('server ready port 4000',)
    })
}

startServer();