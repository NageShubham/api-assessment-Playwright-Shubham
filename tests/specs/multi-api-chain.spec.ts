//multi-api-chain.spec.ts

import { test, expect } from '@playwright/test';

test.describe('4-API CHAIN — FULL DATA FLOW', () => {

  test('4-API aggregation chain — all data flows in one function', async ({ request }) => {

    
    // STEP 1: DummyJSON Login
    
    let djToken: string;
    let djUserId: number;

    const loginRes = await request.post('https://dummyjson.com/auth/login',
      {
        data: {
          username: 'emilys',
          password: 'emilyspass'
        }
      }
    );

    expect(loginRes.status()).toBe(200);

    const loginBody = await loginRes.json();

    djToken = loginBody.accessToken;
    djUserId = loginBody.id;

    expect(djToken).toBeTruthy();
    expect(djUserId).toBeTruthy();

    
    // STEP 2: Products (Top price)
   
    let premiumProductTitle: string;
    let premiumPrice: number;

    const productRes = await request.get('https://dummyjson.com/products?limit=5&skip=0');

    expect(productRes.status()).toBe(200);

    const productBody = await productRes.json();

    const products = productBody.products;

    let maxProduct = products[0];

    for (const p of products) {
      if (p.price > maxProduct.price) {
        maxProduct = p;
      }
    }

    premiumProductTitle = maxProduct.title;
    premiumPrice = maxProduct.price;

    expect(premiumProductTitle.length).toBeGreaterThan(0);

    
    // STEP 3: FakeStore Login
 
    let fakeToken: string;

    const fakeRes = await request.post(
      'https://fakestoreapi.com/auth/login',
      {
        data: {
          username: 'mor_2314',
          password: '83r5^_'
        }
      }
    );

    expect(fakeRes.status()).toBe(201);

    const fakeBody = await fakeRes.json();

    fakeToken = fakeBody.token;

    expect(fakeToken).toBeTruthy();

    // Token mismatch validation
    expect(fakeToken).not.toBe(djToken);

    
    // STEP 4: RestCountries
    
    let capitalCity: string;
    let germanyPop: number;

    const countryRes = await request.get(
      'https://restcountries.com/v3.1/name/germany?fields=name,capital,population'
    );

    expect(countryRes.status()).toBe(200);

    const countryBody = await countryRes.json();

    capitalCity = countryBody[0].capital[0];
    germanyPop = countryBody[0].population;

    expect(capitalCity).toBe('Berlin');

    
    // STEP 5: Final POST (Audit Report)
   
    const finalBody = {
      title: 'Chain Report',
      body: `DJUser:${djUserId}|Premium:${premiumProductTitle}@$${premiumPrice}|Capital:${capitalCity}|Pop:${germanyPop}`,
      userId: 1
    };

    const postRes = await request.post(
      'https://jsonplaceholder.typicode.com/posts',
      {
        data: finalBody
      }
    );

    expect(postRes.status()).toBe(201);

    const postResponseBody = await postRes.json();

    expect(postResponseBody.id).toBe(101);

    
    // FINAL AUDIT VALIDATION
    
    expect(postResponseBody.body).toContain('Berlin');

    expect(postResponseBody.body).toContain(premiumProductTitle);

    expect(postResponseBody.body).toContain(djUserId.toString());
  });

});