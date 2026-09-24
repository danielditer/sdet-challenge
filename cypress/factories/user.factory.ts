import { User } from '../types/user.types';

export class UserFactory {
    static create(overrides: Partial<User> = {}): User {
        return {
            name: 'John Doe',
            email: `john-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 8)}@example.com`,
            age: 30,
            ...overrides,
        };
    }
}