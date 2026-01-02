# LINE Login 設定指南

## 1. 建立 LINE Login Channel

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 登入你的 LINE 帳號
3. 點擊「Create Provider」（如果還沒有的話）
   - Provider 名稱：`添喜設計` 或 `Tensy Design`
4. 點擊「Create a new channel」
5. 選擇「LINE Login」
6. 填寫資料：
   - Channel name: `添喜設計`
   - Channel description: `添喜設計會員登入`
   - App type: `Web app`
   - Email: 你的 email

## 2. 設定 LINE Login Channel

建立後，進入 Channel 設定：

### Basic settings
- 記下 **Channel ID**
- 記下 **Channel secret**（點擊「Issue」產生）

### LINE Login 設定
- 在「LINE Login」分頁
- **Callback URL** 設定為：
  ```
  https://thetensy.com/api/auth/line/callback
  ```
  （如果是測試環境，可以先用 `http://localhost:4321/api/auth/line/callback`）

## 3. 部署 Cloudflare Worker

### 建立 Worker
1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 選擇你的帳號
3. 點擊「Workers & Pages」
4. 點擊「Create Application」→「Create Worker」
5. 命名為 `tensy-auth` 或類似名稱
6. 貼上 `/workers/auth.ts` 的程式碼

### 設定環境變數
在 Worker 的「Settings」→「Variables」中設定：

| 變數名稱 | 值 | 類型 |
|---------|---|------|
| LINE_CHANNEL_ID | 從 LINE Developers 取得 | Plain text |
| LINE_CHANNEL_SECRET | 從 LINE Developers 取得 | **Secret** |
| JWT_SECRET | 自己產生一個隨機字串（32字元以上） | **Secret** |

產生 JWT_SECRET 的方式：
```bash
openssl rand -base64 32
```
或在 Node.js：
```javascript
require('crypto').randomBytes(32).toString('base64')
```

### 設定路由
在 Worker 的「Settings」→「Triggers」→「Routes」：
```
thetensy.com/api/auth/*
```

## 4. 測試流程

1. 開啟 https://thetensy.com/member
2. 點擊「LINE 登入」
3. 應該會跳轉到 LINE 的授權頁面
4. 授權後會跳回 https://thetensy.com/member?login=success
5. 應該可以看到你的 LINE 名稱和大頭貼

## 5. 注意事項

- LINE Login Channel 建立後需要等待審核（通常幾分鐘）
- Channel secret 要保密，不要放在前端程式碼
- Callback URL 必須完全符合，包含 https 和路徑
- 開發時可以先用 localhost，但正式上線要改成正式網域

## 6. 串接 D1 Database（之後）

目前會員資料是存在 localStorage，正式上線需要：
1. 建立 Cloudflare D1 Database
2. 建立會員資料表
3. 在 Worker 中串接 D1

資料表結構：
```sql
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  line_id TEXT UNIQUE,
  name TEXT,
  avatar TEXT,
  email TEXT,
  balance INTEGER DEFAULT 0,
  total_deposit INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'basic',
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE deposits (
  id TEXT PRIMARY KEY,
  member_id TEXT,
  amount INTEGER,
  code TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  bank_last5 TEXT,
  created_at TEXT,
  confirmed_at TEXT,
  FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  member_id TEXT,
  items TEXT,
  total INTEGER,
  discount_rate REAL DEFAULT 1,
  final_amount INTEGER,
  status TEXT DEFAULT 'pending',
  paid_at TEXT,
  created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES members(id)
);
```

---

有問題可以問我！
