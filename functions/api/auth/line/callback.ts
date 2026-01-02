// /api/auth/line/callback - 處理 LINE 登入回調

interface Env {
  LINE_CHANNEL_ID: string;
  LINE_CHANNEL_SECRET: string;
  JWT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const redirectUri = `${url.origin}/api/auth/line/callback`;
  
  // 檢查錯誤
  if (error) {
    return redirectWithError(url.origin, 'LINE 登入被取消');
  }
  
  if (!code || !state) {
    return redirectWithError(url.origin, '缺少必要參數');
  }
  
  // 驗證 state
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  if (cookies.line_state !== state) {
    return redirectWithError(url.origin, 'State 驗證失敗');
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
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return redirectWithError(url.origin, 'Token 交換失敗');
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
      return redirectWithError(url.origin, '取得用戶資料失敗');
    }
    
    const profile = await profileResponse.json() as {
      userId: string;
      displayName: string;
      pictureUrl?: string;
      statusMessage?: string;
    };
    
    // 3. 建立會員資料
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
    
    // 4. 把會員資料編碼傳給前端（用 URL hash，更可靠）
    const memberData = encodeURIComponent(JSON.stringify(member));
    
    // 5. 導向會員頁面，前端會讀取 hash 並存到 localStorage
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${url.origin}/member?login=success#member=${memberData}`,
      },
    });
    
  } catch (error) {
    console.error('LINE Login error:', error);
    return redirectWithError(url.origin, '登入過程發生錯誤');
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

function redirectWithError(origin: string, message: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': `${origin}/member?error=${encodeURIComponent(message)}`,
    },
  });
}

async function createSessionToken(payload: any, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({
    ...payload,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
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
