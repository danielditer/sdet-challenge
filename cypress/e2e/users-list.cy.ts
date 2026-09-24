import { userService } from '../support/services/user.service';

describe('Users API - GET /users', () => {
    it('returns 200 and an array of users', () => {
        userService.getAll().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });
});