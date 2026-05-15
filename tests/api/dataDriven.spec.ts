import { test, expect } from '@playwright/test';

test.describe('Data Driven Debug', () => {

});

test.describe('Data Driven API Tests', () => {
    const users = [
        { id: 1, status: 200 },
        { id: 2, status: 200 },
        { id: 3, status: 200 },
        { id: 4, status: 200 },
        { id: 999, status: 404 },
    ];

    users.forEach(({ id, status }) => {
        test(`GET /api/users/${id} returns ${status}`, async ({
            request,
        }) => {
            const res = await request.get(
                `https://reqres.in/api/users/${id}`
            );

            expect(res.status()).toBe(status);
        });
    });

    const loginScenarios = [
        {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka',
            expectedStatus: 200,
            scenario: 'valid',
        },
        {
            email: 'wrong@email.com',
            password: 'badpass',
            expectedStatus: 400,
            scenario: 'bad-user',
        },
        {
            email: 'eve.holt@reqres.in',
            password: '',
            expectedStatus: 400,
            scenario: 'wrong-pass',
        },
        {
            email: '',
            password: '',
            expectedStatus: 400,
            scenario: 'empty-creds',
        },
    ];

    loginScenarios.forEach(
        ({
            email,
            password,
            expectedStatus,
            scenario,
        }) => {
            test(`Login scenario: ${scenario}`, async ({
                request,
            }) => {
                const res = await request.post(
                    'https://reqres.in/api/login',
                    {
                        data: {
                            email,
                            password,
                        },
                    }
                );

                //expect(res.status()).toBe(expectedStatus);


                const body = await res.json();

                expect(res.status()).toBe(expectedStatus);

                if (expectedStatus === 200) {
                    expect(body.token).toBeTruthy();
                } else {
                    expect(body.error).toBeTruthy();
                }
            });
        }
    );

    test('5-step cross-API chain', async ({ request }) => {
        // Step 1
        const loginReqres = await request.post(
            'https://reqres.in/api/login',
            {
                data: {
                    email: 'eve.holt@reqres.in',
                    password: 'cityslicka',
                },
            }
        );

        expect(loginReqres.status()).toBe(200);

        const reqresBody = await loginReqres.json();

        const reqresToken = reqresBody.token;

        expect(reqresToken).toBeTruthy();

        // Step 2
        const usersRes = await request.get(
            'https://reqres.in/api/users?page=2'
        );

        expect(usersRes.status()).toBe(200);

        const usersBody = await usersRes.json();

        const lastUser =
            usersBody.data[usersBody.data.length - 1];

        const lastUserFirstName = lastUser.first_name;

        expect(lastUserFirstName).toBeTruthy();

        // Step 3
        const storeLogin = await request.post(
            'https://fakestoreapi.com/auth/login',
            {
                data: {
                    username: 'johnd',
                    password: 'm38rmF$',
                },
            }
        );

        expect(storeLogin.status()).toBe(201);

        const storeBody = await storeLogin.json();

        const storeToken = storeBody.token;

        expect(storeToken.startsWith('eyJ')).toBeTruthy();

        // Step 4
        const electronicsRes = await request.get(
            'https://fakestoreapi.com/products/category/electronics'
        );

        expect(electronicsRes.status()).toBe(200);

        const electronics = await electronicsRes.json();

        const mostExpensivePrice = Math.max(
            ...electronics.map((p: any) => p.price)
        );

        expect(mostExpensivePrice).toBeGreaterThan(0);

        const mostExpensiveProduct = electronics.find(
            (p: any) => p.price === mostExpensivePrice
        );

        const productTitle = mostExpensiveProduct.title;

        // Step 5
        const finalPost = await request.post(
            'https://jsonplaceholder.typicode.com/posts',
            {
                data: {
                    reqresToken,
                    lastUserFirstName,
                    storeToken,
                    productTitle,
                    mostExpensivePrice,
                },
            }
        );

        expect(finalPost.status()).toBe(201);

        const finalBody = await finalPost.json();

        expect(finalBody.productTitle).toBe(productTitle);
    });
});