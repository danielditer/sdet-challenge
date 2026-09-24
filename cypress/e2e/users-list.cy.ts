import { userService } from '../support/services/user.service';
import {UserFactory} from "../factories/user.factory";

describe('Users API - GET /users', () => {
    it('returns 200 and an array of users', () => {
        userService.getAll().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('includes a newly created user in the list', () => {
        const user = UserFactory.create();
        userService.create(user).then((created) => {
            expect(created.status).to.eq(201);
            userService.getAll().then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.deep.include(user);
            });
        });
    });

    it('handles an unexpected query parameter without a server error (exploratory)', () => {
        cy.request({ method: 'GET', url: `${userService.baseEndpoint}?unexpected=value`, failOnStatusCode: false })
            .then((response) => expect(response.status).to.be.within(200, 499));
    });
});