import { test as base, APIRequestContext, expect } from '@playwright/test';
type AuthFixtures = {
    reqresToken: string;
    fakestoreToken: string;
};
export const test = base.extend<AuthFixtures>({
    reqresToken: async ({ request }, use) => {
        const res = await request.post('https://reqres.in/api/login', {
            data: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
        });
        expect(res.status()).toBe(200);
        const { token } = await res.json();
        expect(token).toBeTruthy();
        await use(token);
    },
    fakestoreToken: async ({ request }, use) => {
        const res = await request.post('https://fakestoreapi.com/auth/login', {
            data: { username: 'johnd', password: 'm38rmF$' },
        });
        expect(res.status()).toBe(201);
        const { token } = await res.json();
        expect(token).toBeTruthy();
        await use(token);
    },
});
export { expect } from '@playwright/test';