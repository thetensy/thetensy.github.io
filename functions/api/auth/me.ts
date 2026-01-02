// /api/auth/me - 取得目前登入的會員資料

interface Env {
  JWT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const sessionToken = cookies.session;
  
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    const member = await verifySessionToken(sessionToken, env.JWT_SECRET);
    
    return new Response(JSON.stringify({ member }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  return cookies;
}

async function verifySessionToken(token: string, secret: string): Promise<any> {
  const [header, body, signature] = token.split('.');
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  const sigBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    sigBytes,
    encoder.encode(`${header}.${body}`)
  );
  
  if (!valid) {
    throw new Error('Invalid signature');
  }
  
  const payload = JSON.parse(atob(body));
  
  if (payload.exp && payload.exp < Date.now()) {
    throw new Error('Token expired');
  }
  
  return payload;
}
