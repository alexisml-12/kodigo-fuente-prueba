import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('../src/db/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ '1': 1 }])
  }
}));

import { createApp } from '../src/app';

describe('GET /health', () => {
  it('responde 200 cuando la base de datos está disponible', async () => {
    const app = createApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
