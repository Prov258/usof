import { faker } from '@faker-js/faker';

import Seeder from './Seeder';
import { Post, User } from '@prisma/client';

class CommentSeed extends Seeder {
    private users: User[];
    private posts: Post[];

    constructor(users: User[], posts: Post[], count: number = 10) {
        super(count);
        this.users = users;
        this.posts = posts;
        this.count = count;
        this.createData();
    }

    createData() {
        for (let i = 0; i < this.count; i++) {
            const user = faker.helpers.arrayElement(this.users);
            const post = faker.helpers.arrayElement(this.posts);

            this._data.push({
                content: faker.lorem.sentence(),
                authorId: user.id,
                postId: post.id,
            });
        }
    }
}

export default CommentSeed;
