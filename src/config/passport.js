import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserDaom from '../daom/UserDaom';
import { jwt } from './config';
import { tokenTypes } from './tokens';
import TokenDaom from '../daom/TokenDaom';
import RedisService from '../services/RedisService';
import { user as _user } from '../models';

const User = _user;
const jwtOptions = {
    secretOrKey: jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true,
};

//authentication sequence
const jwtVerify = async (req, payload, done) => {
    try {
        if (payload.type !== tokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }
        const userDaom = new UserDaom();
        const tokenDaom = new TokenDaom();
        const redisService = new RedisService();
        const authorization =
            req.headers.authorization !== undefined ? req.headers.authorization.split(' ') : [];
        if (authorization[1] === undefined) {
            return done(null, false);
        }

        let tokenDoc = redisService.hasToken(authorization[1], 'access_token');
        if (!tokenDoc) {
            console.log('Cache Missed!');
            tokenDoc = await tokenDaom.findOne({
                token: authorization[1],
                type: tokenTypes.ACCESS,
                blacklisted: false,
            });
        }
        if (!tokenDoc) {
            return done(null, false);
        }
        let user = await redisService.getUser(payload.sub);
        if (user) {
            user = new User(user);
        }
        if (!user) {
            console.log('User Cache Missed!');
            user = await userDaom.findOneByWhere({ uuid: payload.sub });
            redisService.setUser(user);
        }
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error, false);
    }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default {
    jwtStrategy,
};
