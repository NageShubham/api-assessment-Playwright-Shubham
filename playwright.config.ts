import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 20_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://reqres.in',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': 'pro_d531b57cd621c0b71925c2298af8fc3de6636c798056364f53034171161a02ef',
      'x-requested-Env': 'production'
    },
  },
  projects: [
    {
      name: 'reqres-api',
      testMatch: '**/reqres*.spec.ts',
      use: { baseURL: process.env.BASE_URL || 'https://reqres.in' },
    },
    {
      name: 'fakestore-api',
      testMatch: '**/store*.spec.ts',
      use: { baseURL: 'https://fakestoreapi.com' },
    },
    {
    name: 'data-driven',
    testMatch: '**/dataDriven.spec.ts',
  },
  ],
});