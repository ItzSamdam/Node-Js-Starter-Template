const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [
            {
                first_name: 'Samuel',
                last_name: 'Damilola',
                email: 'sowadayo@example.com',
                status: 1,
                email_verified: 1,
                password: bcrypt.hashSync('secureNode123', 8),
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    },
};
