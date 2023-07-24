import SuperDaom from './SuperDaom';
import { token } from '../models';

const Token = token;

class TokenDaom extends SuperDaom {
    constructor() {
        super(Token);
    }

    async findOne(where) {
        return Token.findOne({ where });
    }

    async remove(where) {
        return Token.destroy({ where });
    }
}

export default TokenDaom;
