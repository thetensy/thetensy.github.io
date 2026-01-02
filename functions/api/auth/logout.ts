// /api/auth/logout - 登出

export const onRequestPost: PagesFunction = async (context) => {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; Max-Age=0',
    },
  });
};

// 也支援 GET 方便測試
export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  
  return new Response(null, {
    status: 302,
    headers: {
      'Location': `${url.origin}/member`,
      'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; Max-Age=0',
    },
  });
};
