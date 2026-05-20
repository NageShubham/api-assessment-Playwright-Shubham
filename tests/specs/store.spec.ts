//store.spec.ts
import process from 'process';
import { test, expect } from '../fixtures/auth.fixture';

const baseURL = process.env.fakestore_base_url || 'https://fakestoreapi.com';


test('Test 1:GET /products returns 20 products with valid schema', async ({ request,fakestoreToken }) => {

  const res = await request.get('https://fakestoreapi.com/products', {
    headers: {
      Authorization: `Bearer ${fakestoreToken}`

    }
  });
  
  console.log(res.url());
  console.log(res.status());

 expect([200, 201]).toContain(res.status());

  const products = await res.json();

  expect(products.length).toBe(20);

  products.forEach((product: any) => {

    expect(typeof product.id).toBe('number');

    expect(typeof product.title).toBe('string');
    expect(product.title.length).toBeGreaterThan(0);

    expect(typeof product.price).toBe('number');
    expect(product.price).toBeGreaterThan(0);

    expect(typeof product.category).toBe('string');

    expect(typeof product.image).toBe('string');
    expect(product.image.startsWith('http')).toBeTruthy();

    expect(typeof product.rating.rate).toBe('number');
    expect(product.rating.rate).toBeGreaterThanOrEqual(0);
    expect(product.rating.rate).toBeLessThanOrEqual(5);

    expect(typeof product.rating.count).toBe('number');
    expect(product.rating.count).toBeGreaterThanOrEqual(0);

  });

});

test('Test 2:GET /products/categories returns exact 4 categories', async ({ request }) => {

  const res = await request.get('https://fakestoreapi.com/products/categories');

  expect(res.status()).toBe(200);

  const cats = await res.json();

  expect(cats.length).toBe(4);

  expect(cats).toEqual(
    expect.arrayContaining([
      'electronics',
      'jewelery',
      "men's clothing",
      "women's clothing"
    ])
  );

});

test('Test 3:POST /auth/login returns JWT token', async ({ request }) => {

  const res = await request.post('https://fakestoreapi.com/auth/login', {
    data: {
      username: 'mor_2314',
      password: '83r5^_'
    }
  });

  expect(res.status()).toBe(201);

  const body = await res.json();

  expect(body.token).toBeTruthy();

  expect(body.token.startsWith('eyJ')).toBeTruthy();

});

test('Test 4:GET /products/category/electronics returns 6 electronics', async ({ request, fakestoreToken }) => {

  const res = await request.get('https://fakestoreapi.com/products/category/electronics');

  expect(res.status()).toBe(200);

  const prods = await res.json();

  // Check count
  expect(prods.length).toBe(6);

  // Check all belong to electronics
  prods.forEach((p: any) => {
    expect(p.category).toBe('electronics');
  });

  // Find max price
  const maxPrice = Math.max(...prods.map((p: any) => p.price));

  expect(maxPrice).toBeGreaterThan(0);

});
test('Test 5:POST /carts creates cart with correct product', async ({ request }) => {

  const res = await request.post('https://fakestoreapi.com/carts', {
    data: {
      userId: 1,
      date: '2024-12-01',
      products: [
        {
          productId: 1,
          quantity: 3
        }
      ]
    }
  });

  expect(res.status()).toBe(201);

  const body = await res.json();

  expect(body.id).toBeTruthy();

  expect(body.products[0].productId).toBe(1);

  expect(body.products[0].quantity).toBe(3);

});

