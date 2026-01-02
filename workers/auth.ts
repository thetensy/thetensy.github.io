/**
 * 添喜設計 - LINE Login Cloudflare Worker
 * 
 * 部署方式：
 * 1. 到 Cloudflare Dashboard → Workers & Pages → Create
 * 2. 貼上此程式碼
 * 3. 設定環境變數（Settings → Variables）：
 *    - LINE_CHANNEL_ID: LINE Login Channel ID
 *    - LINE_CHANNEL_SECRET: LINE Login Channel Secret
 *    - JWT_SECRET: 用來簽署 session token 的密鑰
 * 4. 設定 Custom Domain 或使用 workers.dev 網域
 * 5. 在 LINE Developers Console 設定 Callback URL
 */

export interface Env {
  LINE_CHANNEL_ID: string;
  LINE_CHANNEL_SECRET: string;
  JWT_SECRET: string;
  // D1 Database（之後串接）
  // DB: D1Database;
}

// CORS 設定 - 根據請求來源動態設定
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  
  // 允許的來源
  const allowedOrigins = [
    'https://thetensy.com',
    'https://www.thetensy.com',
    'http://localhost:4321',
    'http://localhost:3000',
  ];
  
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(request);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // 路由
    switch (url.pathname) {
      case '/api/auth/line':
        return handleLineLogin(request, env);
      case '/api/auth/line/callback':
        return handleLineCallback(request, env);
      case '/api/auth/me':
        return handleGetMe(request, env, corsHeaders);
      case '/api/auth/logout':
        return handleLogout(request, env, corsHeaders);
      default:
        return new Response('Not Found', { status: 404 });
    }
  },
};

// 導向 LINE 登入頁面
async function handleLineLogin(request: Request, env: Env): Promise<Response> {
  const state = generateState();
  const redirectUri = getCallbackUrl(request);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: env.LINE_CHANNEL_ID,
    redirect_uri: redirectUri,
    scope: 'profile openid',
    state: state,
  });
  
  const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
  
  // 設定 state cookie（用來驗證 callback）
  return new Response(null, {
    status: 302,
    headers: {
      'Location': loginUrl,
      'Set-Cookie': `line_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}

// 取得 callback URL（根據環境自動判斷）
function getCallbackUrl(request: Request): string {
  const url = new URL(request.url);
  return `${url.origin}/api/auth/line/callback`;
}

// 處理 LINE 登入 callback
async function handleLineCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const redirectUri = getCallbackUrl(request);
  
  // 檢查錯誤
  if (error) {
    return redirectWithError('LINE 登入被取消');
  }
  
  if (!code || !state) {
    return redirectWithError('缺少必要參數');
  }
  
  // 驗證 state（從 cookie 取得）
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  if (cookies.line_state !== state) {
    return redirectWithError('State 驗證失敗');
  }
  
  try {
    // 1. 用 code 換取 access_token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: env.LINE_CHANNEL_ID,
        client_secret: env.LINE_CHANNEL_SECRET,
      }),
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Token exchange failed:', error);
      return redirectWithError('Token 交換失敗');
    }
    
    const tokenData = await tokenResponse.json() as {
      access_token: string;
      id_token: string;
      token_type: string;
      expires_in: number;
    };
    
    // 2. 用 access_token 取得用戶資料
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!profileResponse.ok) {
      return redirectWithError('取得用戶資料失敗');
    }
    
    const profile = await profileResponse.json() as {
      userId: string;
      displayName: string;
      pictureUrl?: string;
      statusMessage?: string;
    };
    
    // 3. 建立或更新會員資料
    // TODO: 串接 D1 Database
    const member = {
      id: `line_${profile.userId}`,
      lineId: profile.userId,
      name: profile.displayName,
      avatar: profile.pictureUrl || '',
      balance: 0,
      totalDeposit: 0,
      tier: 'basic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // 4. 簽發 session token（簡易版 JWT）
    const sessionToken = await createSessionToken(member, env.JWT_SECRET);
    
    // 5. 設定 cookie 並導向會員頁面
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/member?login=success',
        'Set-Cookie': [
          `session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
          `line_state=; Path=/; HttpOnly; Secure; Max-Age=0`,
        ].join(', '),
      },
    });
    
  } catch (error) {
    console.error('LINE Login error:', error);
    return redirectWithError('登入過程發生錯誤');
  }
}

// 取得目前登入的會員資料
async function handleGetMe(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const sessionToken = cookies.session;
  
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  try {
    const member = await verifySessionToken(sessionToken, env.JWT_SECRET);
    
    return new Response(JSON.stringify({ member }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// 登出
async function handleLogout(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; Max-Age=0',
    },
  });
}

// ===== 工具函數 =====

function generateState(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let state = '';
  for (let i = 0; i < 32; i++) {
    state += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return state;
}

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

function redirectWithError(message: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': `/member?error=${encodeURIComponent(message)}`,
    },
  });
}

// 簡易版 JWT（生產環境建議用 @tsndr/cloudflare-worker-jwt）
async function createSessionToken(payload: any, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({
    ...payload,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 天
  }));
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${header}.${body}`)
  );
  
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${header}.${body}.${sig}`;
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
