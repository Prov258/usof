import { faker } from '@faker-js/faker';

import Seeder from './Seeder';
import { Comment, LikeType, Post, User } from '@prisma/client';

class LikeSeed extends Seeder {
    private users: User[];
    private comments: Comment[];
    private posts: Post[];

    constructor(
        users: User[],
        comments: Comment[],
        posts: Post[],
        count: number = 10,
    ) {
        super(count);
        this.users = users;
        this.comments = comments;
        this.posts = posts;
        this.count = count;
        this.createData();
    }

    createData() {
        const userPostSet = new Set<string>();
        const userCommentSet = new Set<string>();

        for (let i = 0; i < this.count; i++) {
            const user = faker.helpers.arrayElement(this.users);
            let postId = null;
            let commentId = null;

            if (Math.random() < 0.5) {
                postId = faker.helpers.arrayElement(this.posts)?.id;
                const uniqueKey = `${user.id}-${postId}`;

                if (userPostSet.has(uniqueKey)) {
                    continue;
                }

                userPostSet.add(uniqueKey);
            } else {
                commentId = faker.helpers.arrayElement(this.comments)?.id;
                const uniqueKey = `${user.id}-${commentId}`;

                if (userCommentSet.has(uniqueKey)) {
                    continue;
                }

                userCommentSet.add(uniqueKey);
            }

            this._data.push({
                authorId: user.id,
                postId,
                commentId,
                type: faker.helpers.enumValue(LikeType),
            });
        }
    }
}

export default LikeSeed;
