// LINE Login 設定
// Channel 資訊已設定完成

export const lineLoginConfig = {
  // LINE Login Channel ID
  channelId: '2008810910',
  
  // LINE Login Channel Secret（存在 Cloudflare Workers Secrets，不要寫在這裡）
  // channelSecret: 存在環境變數
  
  // 授權範圍
  scope: 'profile openid',
  
  // LINE OAuth URLs
  authUrl: 'https://access.line.me/oauth2/v2.1/authorize',
  tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
  profileUrl: 'https://api.line.me/v2/profile',
  
  // 登入成功後導向的頁面
  successRedirect: '/member',
  
  // 登入失敗後導向的頁面
  failRedirect: '/member?error=login_failed'
};

// 生成 LINE 登入 URL
export function getLineLoginUrl(state?: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: lineLoginConfig.channelId,
    redirect_uri: lineLoginConfig.callbackUrl,
    scope: lineLoginConfig.scope,
    state: state || generateState(),
  });
  
  return `${lineLoginConfig.authUrl}?${params.toString()}`;
}

// 生成隨機 state（防止 CSRF）
export function generateState(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let state = '';
  for (let i = 0; i < 32; i++) {
    state += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return state;
}
