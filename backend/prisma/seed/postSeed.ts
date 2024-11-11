import range from 'lodash/range';
import { faker } from '@faker-js/faker';

import Seeder from './Seeder';
import { Status } from '@prisma/client';

class PostSeed extends Seeder {
    constructor(count: number = 10) {
        super(count);
        this.count = count;
        this.createData();
    }

    createData() {
        for (let i = 0; i < this.count; i++) {
            this._data.push({
                title: faker.lorem.sentence(),
                status: faker.helpers.enumValue(Status),
                content: faker.lorem.sentence(),
            });
        }
    }
}

export default PostSeed;
