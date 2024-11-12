import { faker } from '@faker-js/faker';

import Seeder from './Seeder';
import { Post } from '@prisma/client';

class CategorySeed extends Seeder {
    private posts: Post[];

    constructor(posts: Post[], count: number = 10) {
        super(count);
        this.posts = posts;
        this.count = count;
        this.createData();
    }

    createData() {
        for (let i = 0; i < this.count; i++) {
            const somePosts = faker.helpers.arrayElements(this.posts);

            this._data.push({
                title: faker.lorem.sentence(),
                description: faker.lorem.sentence(),
                posts: {
                    create: somePosts.map((p) => ({
                        post: {
                            connect: {
                                id: p.id,
                            },
                        },
                    })),
                },
            });
        }
    }
}

export default CategorySeed;
