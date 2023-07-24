import { authenticate } from 'passport';
import { UNAUTHORIZED } from 'http-status';
import ApiError from '../utilities/ApiError';

const verifyCallback = (req, res, resolve, reject) => {
    return async (err, user, info) => {
        if (err || info || !user) {
            return reject(new ApiError(UNAUTHORIZED, 'Please authenticate'));
        }
        req.user = user;

        resolve();
    };
};

const auth = () => {
    return async (req, res, next) => {
        return new Promise((resolve, reject) => {
            authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, res, resolve, reject),
            )(req, res, next);
        })
            .then(() => {
                return next();
            })
            .catch((err) => {
                return next(err);
            });
    };
};

export default auth;
