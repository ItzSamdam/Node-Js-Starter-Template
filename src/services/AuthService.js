import { compare } from 'bcryptjs';
import { OK, BAD_REQUEST, BAD_GATEWAY, NOT_FOUND } from 'http-status';
import UserDaom from '../daom/UserDaom';
import TokenDaom from '../daom/TokenDaom';
import { tokenTypes } from '../config/tokens';
import { returnError, returnSuccess } from '../utilities/responseHandler';
import { error } from '../config/logger';
import RedisService from './RedisService';

class AuthService {
    constructor() {
        this.userDaom = new UserDaom();
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
            let statusCode = OK;
            let user = await this.userDaom.findByEmail(email);
            if (user == null) {
                return returnError(
                    BAD_REQUEST,
                    'Invalid Email Address!',
                );
            }
            const isPasswordValid = await compare(password, user.password);
            user = user.toJSON();
            delete user.password;

            if (!isPasswordValid) {
                statusCode = BAD_REQUEST;
                message = 'Wrong Password!';
                return returnError(statusCode, message);
            }

            return returnSuccess(statusCode, message, user);
        } catch (e) {
            error(e);
            return returnError(BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    /**
     * Log user out
     */
    logout = async (req, res) => {
        const refreshTokenDoc = await this.TokenDaom.findOne({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        if (!refreshTokenDoc) {
            res.status(NOT_FOUND).send({ message: 'User Not found!' });
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
        this.redisService.removeToken(req.body.access_token, 'access_token');
        this.redisService.removeToken(req.body.refresh_token, 'refresh_token');
    };
}

export default AuthService;
