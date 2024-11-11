import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import Seeder from './Seeder';

class UserSeed extends Seeder {
    constructor(count: number = 10) {
        super(count);
        this.count = count;
        this.createData();
    }

    createData() {
        for (let i = 0; i < this.count; i++) {
            this._data.push({
                login: faker.internet.username(),
                password: bcrypt.hashSync('password', 10),
                fullName: faker.person.fullName(),
                email: faker.internet.email(),
                emailVerified: faker.datatype.boolean(),
                avatar: process.env.DEFAULT_AVATAR_PATH,
            });
        }
    }
}

export default UserSeed;
