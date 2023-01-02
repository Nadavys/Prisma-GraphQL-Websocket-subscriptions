import { Prisma, PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedDatabase() {
    // console.log(await prisma.$queryRaw(Prisma.sql`DELETE FROM Message`))
    // console.log(await prisma.$queryRaw(Prisma.sql`DELETE FROM messageFeed`))
    // console.log(await prisma.$queryRaw(Prisma.sql`DELETE FROM User;`))


    await prisma.message.deleteMany();
    await prisma.messageFeed.deleteMany();
    await prisma.user.deleteMany();

    // process.exit(0)

    console.log("seeding db!");

    await Promise.all(['Moe', 'Larry', 'Curly'].map(
        (name) => {
            return prisma.user.create({ data: { name } })
        }
    ));

    await Promise.all(['Sports', 'Technology', 'Cooking'].map(
        (name) => prisma.messageFeed.create({ data: { name } })
    ))


    // const user1 = await prisma.user.findFirst();
    // const curley = await prisma.user.findUnique({where:{name:"Curley"}});

    await prisma.message.create({
        data: {
            body: faker.lorem.paragraph(),
            title: faker.lorem.sentence(),
            feed: { connect: { name: "Cooking" } },
            user: { connect: { name: "Moe" } }
        }
    })

    await prisma.message.create({
        data: {
            body: faker.lorem.paragraph(),
            title: faker.lorem.sentence(),
            feed: { connect: { name: "Sports" } },
            user: { connect: { name: "Larry" } }
        }
    })










}

seedDatabase().then(
    async () => {
        await prisma.$disconnect()
    }
)
    .catch(async (e) => {
        console.log(e)
        await prisma.$disconnect()
        process.exit(1)
    })