import { userService } from '../support/services/user.service';
import { UserFactory } from '../factories/user.factory';

describe('Users API - GET /users/{email}', () => {
    it('returns the user matching an existing email', () => {
        const user = UserFactory.create();

        userService.create(user).then((created) => {
            expect(created.status).to.eq(201);

            userService.getByEmail(user.email).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.include(user);
            });
        });
    });

    it('returns 404 for an unknown email', () => {
        userService.getByEmail(`unknown-${Date.now()}@example.com`).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('error').that.is.a('string');
        });
    });
});
