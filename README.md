# Prisma GraphQL Websocket subscriptions
### Tech Stack:
- PrismaJS
- TypeScript
- Nexus JS
- Apollo Server
- Websockets
- Sqlite

```bash
npm i

npx prisma db push

npx prisma db seed

npm run dev
```

Goto [Apollo Studio](https://studio.apollographql.com/sandbox?endpoint=http%3A%2F%2Flocalhost%3A4000%2Fgraphql)

Create a subscription
```GraphQl
subscription{
  newMessage {
    id
    title
    user {
      name
    }
  }
}
```

Post a new message
```bash

curl --location --request POST 'http://localhost:4000/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"mutation test{\n    createMessage(body: \"my new text body \", title:\"my new message title\", user:\"Moe\", feed:\"Technology\"){\n        id\n        title\n    }\n}","variables":{}}'

```
