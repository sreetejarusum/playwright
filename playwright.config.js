import { defineConfig, devices } from '@playwright/test';


const config = ({
  testDir: './tests',

  timeout: 40 * 1000,
  expect: {
    timeout: 50 * 1000,
  },
  reporter: 'html',
  
  use: {
    browserName: 'chromium',
    headless: false,
  },

});

module.exports = config;

