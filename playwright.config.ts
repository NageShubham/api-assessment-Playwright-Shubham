import { defineConfig } from '@playwright/test';

import  dotenv from 'dotenv';
dotenv.config();


export default defineConfig({

  testDir: './tests/specs',

  fullyParallel: true,

  // Global base URL
  use: {
    baseURL: 'https://dummyjson.com',

    extraHTTPHeaders: {
      Accept: 'application/json'
    }
  },

  // CI-aware retry configuration
  retries: process.env.CI ? 3 : 0,

  // CI-aware workers
  workers: process.env.CI ? 3 : 2,

  timeout: 60000,

  // Required reporters
  reporter: [

    ['list'],

    [
      'html',
      {
        open: 'never'
      }
    ],

    [
      'json',
      {
        outputFile: 'results/results.json'
      }
    ]
  ],

  // 3 named projects
  projects: [

    // Project 1
    {
      name: 'dummyjson-project',

      testMatch: '**/auth-chain.spec.ts',

      use: {
        baseURL: 'https://dummyjson.com'
      }
    },

    // Project 2
    {
      name: 'data-project',

      testMatch: '**/data-brutal.spec.ts',

      use: {
        baseURL: 'https://dummyjson.com'
      }
    },

    // Project 3
    {
      name: 'chain-project',

      testMatch: '**/multi-api-chain.spec.ts',

      use: {
        baseURL: 'https://jsonplaceholder.typicode.com'
      }
    }
  ]
});