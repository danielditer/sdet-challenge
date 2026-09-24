import { userService } from '../support/services/user.service';
import { UserFactory } from '../factories/user.factory';

describe('Users API - PUT /users/{email}', () => {
    it('updates an existing user', () => {
        const original = UserFactory.create();
        const updated = { ...original, name: 'Updated Name', age: 42 };

        userService.create(original).then((created) => {
            expect(created.status).to.eq(201);

            userService.update(original.email, updated).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.include(updated);
            });
        });
    });

    it('returns 404 when updating an unknown user', () => {
        const user = UserFactory.create();

        userService.update(user.email, user).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('error').that.is.a('string');
        });
    });

    it('rejects an invalid email format', () => {
        const user = UserFactory.create();

        userService.create(user).then((created) => {
            expect(created.status).to.eq(201);

            userService.update(user.email, { ...user, email: 'invalid-email' }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('error').that.is.a('string');
            });
        });
    });

    [0, 151, 2.5].forEach((age) => {
        it(`rejects an invalid age ${age}`, () => {
            const user = UserFactory.create();

            userService.create(user).then((created) => {
                expect(created.status).to.eq(201);

                userService.update(user.email, { ...user, age }).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.property('error').that.is.a('string');
                });
            });
        });
    });

    it('rejects changing an email to one already in use', () => {
        const first = UserFactory.create();
        const second = UserFactory.create();

        userService.create(first).then((r1) => {
            expect(r1.status).to.eq(201);

            userService.create(second).then((r2) => {
                expect(r2.status).to.eq(201);

                userService.update(first.email, { ...first, email: second.email }).then((response) => {
                    expect(response.status).to.eq(409);
                    expect(response.body).to.have.property('error').that.is.a('string');
                });
            });
        });
    });
});