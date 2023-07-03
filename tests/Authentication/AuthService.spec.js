const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const httpStatus = require('http-status');
const AuthService = require('../../src/services/AuthService');
const UserDaom = require('../../src/daom/UserDaom');
const models = require('../../src/models');

const User = models.user;
const bcrypt = require('bcryptjs');

let authService;
const loginData = {
    email: 'example@mail.com',
    password: '123123Asd',
};
const userData = {
    first_name: 'Samuel',
    last_name: 'Owadayo',
    email: 'example@mail.com',
    uuid: '4d85f12b-6e5b-468b-a971-eabe8acc9d08',
};
describe('User Login test', () => {
    beforeEach(() => {
        authService = new AuthService();
    });
    afterEach(() => {
        sinon.restore();
    });

    it('User Login successfully', async () => {
        const expectedResponse = {
            statusCode: httpStatus.OK,
            response: {
                status: true,
                code: httpStatus.OK,
                message: 'Login Successful',
                data: {
                    id: 1,
                    first_name: 'Samuel',
                    last_name: 'Owadayo',
                    email: 'example@mail.com',
                    email_verified: 1,
                    uuid: '4d85f12b-6e5b-468b-a971-eabe8acc9d08',
                },
            },
        };
        userData.id = 1;
        userData.password = bcrypt.hashSync(loginData.password, 8);
        userData.email_verified = 1;
        const userModel = new User(userData);

        sinon.stub(UserDaom.prototype, 'findByEmail').callsFake((email) => {
            return userModel;
        });
        const userLogin = await authService.loginWithEmailPassword(
            loginData.email,
            loginData.password,
        );
        expect(userLogin).to.deep.include(expectedResponse);
    });

    it('should show INVALID EMAIL ADDRESS message', async () => {
        const expectedResponse = {
            statusCode: httpStatus.BAD_REQUEST,
            response: {
                status: false,
                code: httpStatus.BAD_REQUEST,
                message: 'Invalid Email Address!',
            },
        };

        sinon.stub(UserDaom.prototype, 'findByEmail').callsFake(() => {
            return null;
        });
        const response = await authService.loginWithEmailPassword('test@mail.com', '23232132');
        expect(response).to.deep.include(expectedResponse);
    });

    it('Wrong Password', async () => {
        const expectedResponse = {
            statusCode: httpStatus.BAD_REQUEST,
            response: {
                status: false,
                code: httpStatus.BAD_REQUEST,
                message: 'Wrong Password!',
            },
        };
        userData.id = 1;
        userData.password = bcrypt.hashSync('2322342343', 8);
        userData.email_verified = 1;
        const userModel = new User(userData);
        sinon.stub(UserDaom.prototype, 'findByEmail').callsFake((email) => {
            return userModel;
        });
        const userLogin = await authService.loginWithEmailPassword(
            loginData.email,
            loginData.password,
        );
        expect(userLogin).to.deep.include(expectedResponse);
    });
});
