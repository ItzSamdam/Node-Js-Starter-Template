const MegaDaom = require('./MegaDaom');
const models = require('../models');

const Token = models.token;

class TokenDaom extends MegaDaom {
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

module.exports = TokenDaom;
