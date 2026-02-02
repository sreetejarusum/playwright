import { test, expect } from '@playwright/test';
import axios from 'axios';

const API_BASE = process.env.API_BASE || 'https://httpbin.org';

test.describe('API sample tests', () => {
  test('GET /get sample', async () => {
    const resp = await axios.get(`${API_BASE}/get`);
    expect(resp.status).toBe(200);
    expect(resp.data).toBeDefined();
  });
});
