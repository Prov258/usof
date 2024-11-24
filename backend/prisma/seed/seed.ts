import { PrismaClient } from '@prisma/client';
import PostSeed from './postSeed';
import UserSeed from './userSeed';
import CommentSeed from './commentSeed';
import CategorySeed from './categorySeed';
import LikeSeed from './likeSeed';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const userSeed = new UserSeed(3);

    await prisma.user.createMany({
        data: userSeed.data,
    });

    const users = await prisma.user.findMany();

    const postSeed = new PostSeed(users, 30);

    await prisma.post.createMany({
        data: postSeed.data,
    });

    const posts = await prisma.post.findMany();

    const commentSeed = new CommentSeed(users, posts, 100);

    await prisma.comment.createMany({
        data: commentSeed.data,
    });

    const comments = await prisma.comment.findMany();

    const categorySeed = new CategorySeed(posts, 8);

    for (let categoryData of categorySeed.data) {
        // doesn't work with createMany
        await prisma.category.create({
            data: categoryData,
        });
    }

    const likeSeed = new LikeSeed(users, comments, posts, 200);

    await prisma.like.createMany({
        data: likeSeed.data,
    });

    await prisma.user.create({
        data: {
            login: 'admin',
            fullName: 'admin',
            email: 'admin@test.com',
            password: await bcrypt.hash('password', 10),
            role: 'ADMIN',
            emailVerified: true
        }
    })
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
