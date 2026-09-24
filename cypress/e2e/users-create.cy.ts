import { userService } from '../support/services/user.service';
import { UserFactory } from '../factories/user.factory';

describe('Users API - POST /users', () => {
    it('creates a user with valid data', () => {
        const user = UserFactory.create();

        userService.create(user).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.include(user);
        });
    });

    it('rejects a request with no body', () => {
        userService.createWithoutBody().then((response) => {
            expect([400, 415, 422]).to.include(response.status);
            expect(response.body).to.have.property('error').that.is.a('string');
        });
    });

    it('rejects missing required fields', () => {
        const cases = [
            { email: 'missing-name@example.com', age: 25 },
            { name: 'Missing email', age: 25 },
            { name: 'Missing age', email: 'missing-age@example.com' },
        ];

        cases.forEach((payload) => {
            userService.create(payload).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('error').that.is.a('string');
            });
        });
    });

    it('rejects invalid email format', () => {
        userService.create(UserFactory.create({ email: 'not-an-email' })).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('error').that.is.a('string');
        });
    });

    [0, 151, 2.5].forEach((age) => {
        it(`rejects invalid age: ${age}`, () => {
            userService.create({ ...UserFactory.create(), age }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('error').that.is.a('string');
            });
        });
    });

    [1, 150].forEach((age) => {
        it(`accepts age boundary ${age}`, () => {
            const user = UserFactory.create({ age });

            userService.create(user).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body).to.include(user);
            });
        });
    });

    it('rejects a duplicate email', () => {
        const user = UserFactory.create();

        userService.create(user).then((created) => {
            expect(created.status).to.eq(201);

            userService.create(user).then((duplicate) => {
                expect(duplicate.status).to.eq(409);
                expect(duplicate.body).to.have.property('error').that.is.a('string');
            });
        });
    });
});
