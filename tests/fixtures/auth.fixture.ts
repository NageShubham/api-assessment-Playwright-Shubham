import { test as base, expect } from '@playwright/test';
import { Buffer } from 'buffer';

type Fixtures = {
  djToken: string;
  fakeToken: string;
  decodedPayload: any;
};

export const test = base.extend<Fixtures>({

  // 1) DummyJSON token fixture
  djToken: async ({ request }, use) => {

    const response = await request.post('https://dummyjson.com/auth/login', {
      data: {
        username: 'emilys',
        password: 'emilyspass'
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.accessToken).toBeTruthy();

    await use(body.accessToken);
  },

  // 2) FakeStore token fixture
  fakeToken: async ({ request }, use) => {

    const response = await request.post(
      'https://fakestoreapi.com/auth/login',
      {
        data: {
          username: 'johnd',
          password: 'm38rmF$'
        }
      }
    );

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.token).toBeTruthy();

    console.log('FakeStore token:', body.token);

    await use(body.token);
  },

  // 3) Decoded JWT payload (depends on djToken)
  decodedPayload: async ({ djToken }: any, use: (arg0: any) => any) => {

    const segment = djToken.split('.')[1];

    const decoded = Buffer
      .from(segment, 'base64')
      .toString();

    const payload = JSON.parse(decoded);

    await use(payload);
  }
});

export { expect } from '@playwright/test';