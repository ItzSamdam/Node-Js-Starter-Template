import SuperDaom from './SuperDaom';
import { user as _user } from '../models';

const User = _user;

class UserDaom extends SuperDaom {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return User.findOne({ where: { email } });
    }

    async isEmailExists(email) {
        return User.count({ where: { email } }).then((count) => {
            return count !== 0;

        });
    }

    async createWithTransaction(user, transaction) {
        return User.create(user, { transaction });
    }
}

export default UserDaom;
