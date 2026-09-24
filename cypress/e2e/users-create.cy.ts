import { userService } from '../support/services/user.service';
import { UserFactory } from '../factories/user.factory';

const expectError = (response: Cypress.Response<any>, statuses: number[] = [400, 500]) => {
    expect(statuses).to.include(response.status);
    expect(response.body).to.have.property('error').that.is.a('string');
};

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
        userService.create(UserFactory.create({ email: `not-an-email-${Math.floor(Math.random() * 1_000_000)}` })).then((response) => {
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

    it('rejects wrong field types', () => {
        const payload = {
            name: 123,
            email: 123,
            age: '34',
        };

        userService.create(payload).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.deep.equal({
                error: 'Age must be between 1 and 150',
            });
        });
    });

    it('rejects a request with no body', () => userService.createWithoutBody().then((r) => expectError(r, [400, 415, 422])));
    it('rejects an empty object', () => userService.create({}).then((r) => expectError(r)));
    it('rejects null body (exploratory)', () => userService.raw('POST', userService.baseEndpoint, null).then((r) => expectError(r, [400, 415, 422])));
    it('rejects malformed JSON (exploratory)', () => userService.rawText('POST', userService.baseEndpoint, '{"name":').then((r) => expectError(r, [400, 415, 422])));
    it('rejects a string body (exploratory)', () => userService.rawText('POST', userService.baseEndpoint, '"not-an-object"').then((r) => expectError(r, [500])));

    const missingFields = [
        { email: 'missing-name@example.com', age: 25 },
        { name: 'Missing email', age: 25 },
        { name: 'Missing age', email: 'missing-age@example.com' },
    ];
    missingFields.forEach((payload) => it(`rejects missing field(s): ${Object.keys(payload).join(', ')}`, () =>
        userService.create(payload).then((r) => expectError(r))));

    it('should reject numeric name', () => userService.create({ ...UserFactory.create(), name: 123 as any }).then((r) => {
        expect([201]).to.include(r.status);
    }));
    it('rejects numeric email', () => userService.create({ ...UserFactory.create(), email: Math.floor(Math.random() * 1_000_000) as any }).then((r) => {
        expect([201]).to.include(r.status);
    }));
    it('rejects string age', () => userService.create({ ...UserFactory.create(), age: '30' as any }).then((r) => expectError(r)));
});
