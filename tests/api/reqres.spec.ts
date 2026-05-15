
//require.spec.ts
 import { test, expect } from '../fixtures/auth.fixture';


test('Test R1: GET /api/users returns correct pagination', async ({ request }) => {

    const res = await request.get('/api/users?page=1', {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'pro_d531b57cd621c0b71925c2298af8fc3de6636c798056364f53034171161a02ef',
            'x-requested-Env': 'production'
            
        }
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    console.log(body);

    // Pagination checks
    expect(body.page).toBe(1);
    expect(body.per_page).toBe(6);
    expect(body.total).toBe(12);
    expect(body.total_pages).toBe(2);

    // Data array check
    expect(body.data.length).toBe(6);

    // Schema validation for all users
    expect(
        body.data.every((user: any) =>
            user.id !== undefined &&
            user.email !== undefined &&
            user.first_name !== undefined &&
            user.last_name !== undefined &&
            user.avatar !== undefined
        )
    ).toBeTruthy();

});

test('Test2: POST /api/users creates user with correct field types', async ({ request }) => {

    const res = await request.post('/api/users', {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'pro_d531b57cd621c0b71925c2298af8fc3de6636c798056364f53034171161a02ef',
            'x-requested-Env': 'production'
        },
    data: {
            name: 'Playwright Engineer',
            job: 'Senior QA'
        }
    });

    expect(res.status()).toBe(201);

    const user = await res.json();

    // Name and job validation
    expect(user.name).toBe('Playwright Engineer');
    expect(user.job).toBe('Senior QA');

    // ID validation
    expect(user.id).toBeTruthy();
    expect(typeof user.id).toBe('string');

    // createdAt validation (ISO format)
    expect(user.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);

});

test('Test 3 auth chain login then use token on GET', async ({ request }) => {

    const loginRes = await request.post('/api/login', {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'pro_d531b57cd621c0b71925c2298af8fc3de6636c798056364f53034171161a02ef',
            'x-requested-Env': 'production'
        },
        data: {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka'
        }
    });

    expect(loginRes.status()).toBe(200);

    const loginBody = await loginRes.json();

    const token = loginBody.token;

    expect(token).toBe('QpwL5tke4Pnpja7X4');

    // Step 2: Use token in GET request
    const userRes = await request.get('/api/users/2', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    expect(userRes.status()).toBe(200);

    const userBody = await userRes.json();

    expect(userBody.data.email).toBe('janet.weaver@reqres.in');

});

test('Test 4: DELETE /api/users/2 returns 204 empty bodyT', async ({ request }) => {
    const Dres = await request.delete('/api/users/2', {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'pro_d531b57cd621c0b71925c2298af8fc3de6636c798056364f53034171161a02ef',
            'x-requested-Env': 'production'
        },

    });

    const Delete_RES = await request.delete('/api/users/2');

    expect(Delete_RES.status()).toBe(204);

    expect(await Delete_RES.text()).toBe('');

})

test('Test 5: Negative: GET /api/users/999 returns 404', async ({ request }) => {
    const N_res = await request.get('/api/users/2', {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'pro_d531b57cd621c0b71925c2298af8fc3de6636c798056364f53034171161a02ef',
            'x-requested-Env': 'production'
        }
    });
   const res = await request.get('/api/unknown/999');

  expect(res.status()).toBe(404);

  expect(await res.json()).toStrictEqual({});

});

test('Test 6:Negative: POST /api/login with wrong password returns 400 with error', async ({ request }) => {

    const res = await request.post('/api/login', {
        data: {
            email: 'wrong@email.com',
            password: 'WRONGPASSWORD'
        }
    });

   
  expect(res.status()).toBe(400);

  const body = await res.json();

  expect(body.error).toBeTruthy();

  expect(body).not.toHaveProperty('token');
});

