import { http, HttpResponse, delay } from 'msw';
import products from './data/products.json';
import solutions from './data/solutions.json';
import users from './data/users.json';
import shippingLines from './data/shippingLines.json';

const registered: Array<{ id: string; username: string; email: string; password: string; country?: string }> =
  [...users];

function makeToken(id: string) {
  return `mock-token-${id}-${Date.now()}`;
}

export const handlers = [
  http.get('/api/products/hot', async () => {
    await delay(150);
    return HttpResponse.json(products.slice(0, 12));
  }),

  http.get('/api/products/search', async ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    await delay(150);
    const list = q
      ? products.filter(
          (p) =>
            p.title_zh.toLowerCase().includes(q) ||
            p.title_en.toLowerCase().includes(q),
        )
      : products;
    return HttpResponse.json(list);
  }),

  http.get('/api/products/:id', async ({ params }) => {
    await delay(150);
    const p = products.find((x) => x.id === params.id);
    if (!p) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(p);
  }),

  http.get('/api/solutions/:id', async ({ params }) => {
    await delay(100);
    const s = solutions.find((x) => x.id === params.id) || solutions[0];
    return HttpResponse.json(s);
  }),

  http.get('/api/shipping/lines', async () => {
    await delay(120);
    return HttpResponse.json(shippingLines);
  }),

  http.get('/api/shipping/lines/:id', async ({ params }) => {
    await delay(120);
    const line = shippingLines.find((l) => l.id === params.id);
    if (!line) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(line);
  }),

  http.post('/api/shipping/quote', async ({ request }) => {
    const body = (await request.json()) as { country: string; weightKg: number };
    await delay(150);
    const country = (body.country || '').toUpperCase();
    const weight = Math.max(0.1, Number(body.weightKg) || 0.5);
    const quotes = shippingLines
      .filter((l) => l.countries.includes(country))
      .map((l) => {
        const billableKg = Math.max(weight, l.minKg);
        const extraKg = Math.max(0, billableKg - 1);
        const feeCNY = Math.round(l.firstKgCNY + extraKg * l.pricePerKgCNY);
        return {
          lineId: l.id,
          name_zh: l.name_zh,
          name_en: l.name_en,
          leadTimeDays: l.leadTimeDays,
          feeCNY,
        };
      });
    return HttpResponse.json({ country, weightKg: weight, quotes });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string };
    await delay(200);
    if (!body?.username || !body?.password) {
      return HttpResponse.json({ message: 'invalid' }, { status: 400 });
    }
    const existing = registered.find(
      (u) => u.username === body.username || u.email === body.username,
    );
    const user = existing ?? {
      id: 'u_' + Math.random().toString(36).slice(2, 8),
      username: body.username,
      email: body.username.includes('@') ? body.username : `${body.username}@demo.local`,
      password: body.password,
    };
    return HttpResponse.json({
      token: makeToken(user.id),
      user: { id: user.id, username: user.username, email: user.email, country: (user as any).country },
    });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      country?: string;
    };
    await delay(250);
    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'missing fields' }, { status: 400 });
    }
    if (registered.some((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'email already registered' }, { status: 409 });
    }
    const user = {
      id: 'u_' + Math.random().toString(36).slice(2, 8),
      username: body.email.split('@')[0],
      email: body.email,
      password: body.password,
      country: body.country,
    };
    registered.push(user);
    return HttpResponse.json({
      token: makeToken(user.id),
      user: { id: user.id, username: user.username, email: user.email, country: user.country },
    });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    const auth = request.headers.get('authorization') || '';
    if (!auth.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({ ok: true });
  }),

  http.post('/api/orders', async ({ request }) => {
    const auth = request.headers.get('authorization') || '';
    if (!auth.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    await delay(400);
    const orderId =
      'SB' +
      Date.now().toString().slice(-8) +
      Math.random().toString(36).slice(2, 6).toUpperCase();
    return HttpResponse.json({
      orderId,
      createdAt: Date.now(),
      status: 'PENDING_PAYMENT',
      echo: body,
    });
  }),
];
