import { PrismaClient } from '@prisma/client';
import PostSeed from './postSeed';
import UserSeed from './userSeed';

const prisma = new PrismaClient();

async function main() {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const posts = new PostSeed();
    const users = new UserSeed(3);

    for (const user of users.data) {
        await prisma.user.create({
            data: {
                ...(user as any),
                posts: {
                    create: posts.data,
                },
            },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
