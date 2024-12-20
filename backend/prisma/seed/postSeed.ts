import { faker } from '@faker-js/faker';
import Seeder from './Seeder';
import { PrismaClient, Status, User } from '@prisma/client';

const prisma = new PrismaClient();

class PostSeed extends Seeder {
    private users: User[];

    constructor(users: User[], count: number = 10) {
        super(count);
        this.count = count;
        this.users = users;
        this.createData();
    }

    createData() {
        for (let i = 0; i < this.count; i++) {
            const user = faker.helpers.arrayElement(this.users);

            this._data.push({
                title: faker.lorem.sentence(),
                status: faker.helpers.enumValue(Status),
                content: faker.lorem.sentence(),
                authorId: user.id,
            });
        }
    }
}

export default PostSeed;
