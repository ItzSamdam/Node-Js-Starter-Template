import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from 'http-status';
import { hashSync, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import UserDaom from '../daom/UserDaom';
import { returnError, returnSuccess } from '../utilities/responseHandler';
import { error } from '../config/logger';
import { userConstant } from '../config/constant';

class UserService {
    constructor() {
        this.userDaom = new UserDaom();
    }

    /**
     * Create a user
     * @param {Object} userBody
     * @returns {Object}
     */
    createUser = async (userBody) => {
        try {
            let message = 'Successfully Registered the account! Please Verify your email.';
            if (await this.userDaom.isEmailExists(userBody.email)) {
                return returnError(BAD_REQUEST, 'Email already taken');
            }
            const uuid = uuidv4();
            userBody.email = userBody.email.toLowerCase();
            userBody.password = hashSync(userBody.password, 8);
            userBody.uuid = uuid;
            userBody.status = userConstant.STATUS_ACTIVE;
            userBody.email_verified = userConstant.EMAIL_VERIFIED_FALSE;

            let userData = await this.userDaom.create(userBody);

            if (!userData) {
                message = 'Registration Failed! Please Try again.';
                return returnError(BAD_REQUEST, message);
            }

            userData = userData.toJSON();
            delete userData.password;

            return returnSuccess(CREATED, message, userData);
        } catch (e) {
            error(e);
            return returnError(BAD_REQUEST, 'Something went wrong!');
        }
    };

    /**
     * Get user
     * @param {String} email
     * @returns {Object}
     */

    isEmailExists = async (email) => {
        const message = 'Email found!';
        if (!(await this.userDaom.isEmailExists(email))) {
            return returnError(BAD_REQUEST, 'Email not Found!!');
        }
        return returnSuccess(OK, message);
    };

    /**
     * Get user by id
     * @returns {Object}
     * @param uuid
     */
    getUserByUuid = async (uuid) => {
        return this.userDaom.findOneByWhere({ uuid });
    };

    /**
     * change password
     * @returns {Object}
     * @param data
     * @param uuid
     */
    changePassword = async (data, uuid) => {
        let message = 'Login Successful';
        let statusCode = OK;
        let user = await this.userDaom.findOneByWhere({ uuid });

        if (!user) {
            return returnError(NOT_FOUND, 'User Not found!');
        }

        if (data.password !== data.confirm_password) {
            return returnError(
                BAD_REQUEST,
                'Confirm password not matched',
            );
        }

        const isPasswordValid = await compare(data.old_password, user.password);
        user = user.toJSON();
        delete user.password;
        if (!isPasswordValid) {
            statusCode = BAD_REQUEST;
            message = 'Wrong old Password!';
            return returnError(statusCode, message);
        }
        const updateUser = await this.userDaom.updateWhere(
            { password: hashSync(data.password, 8) },
            { uuid },
        );

        if (updateUser) {
            return returnSuccess(
                OK,
                'Password updated Successfully!',
                {},
            );
        }

        return returnError(BAD_REQUEST, 'Password Update Failed!');
    };
}

export default UserService;
