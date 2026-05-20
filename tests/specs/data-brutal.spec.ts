// data-brutal.spec.ts

import { test, expect } from '@playwright/test';

test.describe('DATA BRUTAL — Extreme Data Validation', () => {

  //  PRODUCT VALIDATION — 7 SUB TESTS
 
  //This creates 7 sub-tests
  const productIds = [1, 5, 10, 50, 100, 150, 194];

  for (const id of productIds) {

    test(`Product ${id} validation`, async ({ request }) => {

      const response = await request.get(`https://dummyjson.com/products/${id}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body.price).toBeGreaterThan(0);

      expect(body.title.length).toBeGreaterThan(0);

      expect(body.rating).toBeGreaterThanOrEqual(0);

    });

  }

  // (B) LOGIN VALIDATION — 4 SUB TESTS


  const loginScenarios = [

    {
      user: 'emilys',
      pw: 'emilyspass',
      status: 200
    },

    {
      user: 'emilys',
      pw: 'WRONG',
      status: 400
    },

    {
      user: 'nonexistent',
      pw: 'any',
      status: 400
    },

    {
      user: '',
      pw: '',
      status: 400
    }

  ];

  loginScenarios.forEach((data, index) => {

    test(
      `Login validation [${index}] for ${data.user || 'empty-user'} - expected ${data.status}`,
      async ({ request }) => {

        const response = await request.post('https://dummyjson.com/auth/login',{
            data: {
              username: data.user,
              password: data.pw
            }
          }
        );

        expect(response.status()).toBe(data.status);

      }
    );

  });

 
  // (C) COUNTRIES VALIDATION — 5 SUB TESTS


  const countries = [

    ['germany', 'Berlin'],

    ['france', 'Paris'],

    ['japan', 'Tokyo'],

    ['australia', 'Canberra'],

    ['brazil', 'Brasília']

  ];

  for (const [country, expectedCapital] of countries) {

    test(`${country} capital validation`, async ({ request }) => {

      const response = await request.get( `https://restcountries.com/v3.1/name/${country}?fields=name,capital`
         );

      expect(response.status()).toBe(200);

      const body = await response.json();

      const actualCapital = body[0].capital[0];

      expect(actualCapital).toBe(expectedCapital);

    });

  }


  // (D) PRODUCTS — FULL STATISTICAL VALIDATION
 

  test('Products full statistical validation', async ({ request }) => {

    const response = await request.get('https://dummyjson.com/products?limit=0' );

    expect(response.status()).toBe(200);

    const body = await response.json();

    const products = body.products;

    // total products
    expect(products.length).toBeGreaterThan(0);

    // all prices > 0
    for (const product of products) {

      expect(product.price).toBeGreaterThan(0);

    }

    // no duplicate IDs
    const ids = products.map((p: any) => p.id);

    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);

    // minimum 5 categories
    const categories = products.map((p: any) => p.category);

    const uniqueCategories = new Set(categories);

    expect(uniqueCategories.size).toBeGreaterThanOrEqual(5);

  });

  
  // (E) USERS — EMAIL UNIQUENESS VALIDATION


  test('Users email uniqueness validation', async ({ request }) => {

    const response = await request.get('https://dummyjson.com/users?limit=0');

    expect(response.status()).toBe(200);

    const body = await response.json();

    const users = body.users;

    // total users
    expect(users.length).toBeGreaterThan(0);

    // email regex
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const emails = users.map((u: any) => u.email);

    // regex validation
    for (const email of emails) {

      expect(emailRegex.test(email)).toBeTruthy();

    }

    // uniqueness validation
    const uniqueEmails = new Set(emails);

    expect(uniqueEmails.size).toBe(emails.length);

  });

});