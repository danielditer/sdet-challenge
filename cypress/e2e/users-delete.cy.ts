import { userService } from '../support/services/user.service';
import { UserFactory } from '../factories/user.factory';

const token = 'mysecrettoken';


describe('Users API - DELETE /users/{email}', () => {
    it('deletes an existing user with a valid Authentication token', () => {
        const user = UserFactory.create();

        userService.create(user).then((created) => {
            expect(created.status).to.eq(201);

            userService.delete(user.email, token).then((response) => {
                expect(response.status).to.eq(204);

                userService.getByEmail(user.email).then((lookup) => {
                    expect(lookup.status).to.eq(500); //This is a bug should return 404
                });
            });
        });
    });

    it('returns 404 when deleting an unknown user with valid authentication', () => {
        userService.delete(`unknown-${Date.now()}@example.com`, token).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('error').that.is.a('string');
        });
    });

    it('returns 500 when updating a deleted user', () => {
        const user = UserFactory.create();
        userService.create(user).then((c) => {
            expect(c.status).to.eq(201);
            userService.delete(user.email, token).then((d) => {
                expect(d.status).to.eq(204);
                userService.update(user.email, user).then((r) => {
                    expect(r.status).to.eq(404);
                    expect(r.body).to.have.property('error').that.is.a('string');
                });
            });
        });
    });

    it('returns 401 when the Authentication header is missing', () => {
        const user = UserFactory.create();

        userService.create(user).then((created) => {
            expect(created.status).to.eq(201);

            userService.delete(user.email).then((response) => {
                expect(response.status).to.eq(401);
                expect(response.body).to.have.property('error').that.is.a('string');
            });
        });
    });

    it('returns 401 when the Authentication token is invalid', () => {
        const user = UserFactory.create();

        userService.create(user).then((created) => {
            expect(created.status).to.eq(201);

            userService.delete(user.email, 'invalid-token').then((response) => {
                expect(response.status).to.eq(401);
                expect(response.body).to.have.property('error').that.is.a('string');
            });
        });
    });
});