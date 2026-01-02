// /api/auth/line - 導向 LINE 登入頁面

interface Env {
  LINE_CHANNEL_ID: string;
  LINE_CHANNEL_SECRET: string;
  JWT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const state = generateState();
  const redirectUri = `${url.origin}/api/auth/line/callback`;
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: env.LINE_CHANNEL_ID,
    redirect_uri: redirectUri,
    scope: 'profile openid',
    state: state,
  });
  
  const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
  
  return new Response(null, {
    status: 302,
    headers: {
      'Location': loginUrl,
      'Set-Cookie': `line_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
};

function generateState(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let state = '';
  for (let i = 0; i < 32; i++) {
    state += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return state;
}
