import { hashSync } from 'bcryptjs';

export async function up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
        {
            first_name: 'Samuel',
            last_name: 'Damilola',
            email: 'sowadayo@example.com',
            status: 1,
            email_verified: 1,
            password: hashSync('secureNode123', 8),
            created_at: new Date(),
            updated_at: new Date(),
        },
    ]);
}
export async function down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
}
