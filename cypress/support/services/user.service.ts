import type { User } from '../../types/user.types';

type UserPayload = Partial<User> | Record<string, unknown>;

export class UserService {
    private get endpoint(): string {
        const environment = Cypress.env('apiEnvironment') || 'dev';
        return `/${environment}/users`;
    }

    getAll() {
        return cy.request({
            method: 'GET',
            url: this.endpoint,
            failOnStatusCode: false,
        });
    }

    create(user: UserPayload) {
        return cy.request({
            method: 'POST',
            url: this.endpoint,
            body: user,
            failOnStatusCode: false,
        });
    }

    createWithoutBody() {
        return cy.request({
            method: 'POST',
            url: this.endpoint,
            failOnStatusCode: false,
        });
    }

    getByEmail(email: string) {
        return cy.request({
            method: 'GET',
            url: `${this.endpoint}/${encodeURIComponent(email)}`,
            failOnStatusCode: false,
        });
    }

    update(email: string, user: UserPayload) {
        return cy.request({
            method: 'PUT',
            url: `${this.endpoint}/${encodeURIComponent(email)}`,
            body: user,
            failOnStatusCode: false,
        });
    }

    delete(email: string, token?: string) {
        return cy.request({
            method: 'DELETE',
            url: `${this.endpoint}/${encodeURIComponent(email)}`,
            ...(token ? { headers: { Authentication: token } } : {}),
            failOnStatusCode: false,
        });
    }
}

export const userService = new UserService();
