const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const userDaom = require('../daom/userDaom');
const TokenDaom = require('../daom/TokenDaom');
const { tokenTypes } = require('../config/tokens');
const responseHandler = require('../utilities/responseHandler');
const logger = require('../config/logger');
const RedisService = require('./RedisService');

class AuthService {
    constructor() {
        this.userDaom = new userDaom();
        this.TokenDaom = new TokenDaom();
        this.redisService = new RedisService();
    }

    /**
     * Create a user
     * @param {String} email
     * @param {String} password
     * @returns {Promise<{response: {code: *, message: *, status: boolean}, statusCode: *}>}
     */
    loginWithEmailPassword = async (email, password) => {
        try {
            let message = 'Login Successful';
            let statusCode = httpStatus.OK;
            let user = await this.userDaom.findByEmail(email);
            if (user == null) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'Invalid Email Address!',
                );
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            user = user.toJSON();
            delete user.password;

            if (!isPasswordValid) {
                statusCode = httpStatus.BAD_REQUEST;
                message = 'Wrong Password!';
                return responseHandler.returnError(statusCode, message);
            }

            return responseHandler.returnSuccess(statusCode, message, user);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    logout = async (req, res) => {
        const refreshTokenDoc = await this.TokenDaom.findOne({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        if (!refreshTokenDoc) {
            res.status(httpStatus.NOT_FOUND).send({ message: 'User Not found!' });
        }
        await this.TokenDaom.remove({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        await this.TokenDaom.remove({
            token: req.body.access_token,
            type: tokenTypes.ACCESS,
            blacklisted: false,
        });
        await this.redisService.removeToken(req.body.access_token, 'access_token');
        await this.redisService.removeToken(req.body.refresh_token, 'refresh_token');
    };
}

module.exports = AuthService;
