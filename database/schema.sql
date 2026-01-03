-- 添喜設計 D1 資料庫 Schema
-- 包含：會員、訂單、點數系統

-- ===== 會員 =====
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  line_user_id TEXT UNIQUE,
  display_name TEXT NOT NULL,
  picture_url TEXT,
  email TEXT,
  phone TEXT,
  birthday TEXT,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  points_balance INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_members_line_user_id ON members(line_user_id);
CREATE INDEX IF NOT EXISTS idx_members_referral_code ON members(referral_code);

-- ===== 訂單 =====
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending, confirmed, designing, revision, completed, cancelled
  product_type TEXT NOT NULL,     -- logo, namecard, menu, etc.
  plan_id TEXT NOT NULL,          -- basic, standard, advanced
  style_id TEXT,
  style_name TEXT,
  
  -- 品牌資料
  brand_name TEXT NOT NULL,
  brand_name_en TEXT,
  industry TEXT,
  slogan TEXT,
  description TEXT,
  color_preference TEXT,
  custom_color TEXT,
  
  -- 金額
  original_price INTEGER NOT NULL,
  points_discount INTEGER DEFAULT 0,
  final_price INTEGER NOT NULL,
  
  -- 付款
  payment_status TEXT DEFAULT 'unpaid',  -- unpaid, partial, paid
  payment_method TEXT,                    -- bank_transfer, balance
  paid_amount INTEGER DEFAULT 0,
  
  -- 設計進度
  current_revision INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 2,
  designer_note TEXT,
  
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  
  FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_member_id ON orders(member_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- ===== 點數交易 =====
CREATE TABLE IF NOT EXISTS point_transactions (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  type TEXT NOT NULL,           -- earn, redeem, expire, adjust
  amount INTEGER NOT NULL,      -- 正數=獲得，負數=扣除
  balance_after INTEGER NOT NULL,
  source TEXT NOT NULL,         -- google_review, referral, birthday, redeem, etc.
  order_id TEXT,
  description TEXT,
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX IF NOT EXISTS idx_point_transactions_member_id ON point_transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_type ON point_transactions(type);
CREATE INDEX IF NOT EXISTS idx_point_transactions_source ON point_transactions(source);

-- ===== 儲值記錄 =====
CREATE TABLE IF NOT EXISTS deposits (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending, confirmed, cancelled
  payment_method TEXT,
  bank_last_5 TEXT,
  confirmed_at TEXT,
  confirmed_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE INDEX IF NOT EXISTS idx_deposits_member_id ON deposits(member_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);

-- ===== 推薦關係 =====
CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL,     -- 推薦人
  referee_id TEXT NOT NULL,      -- 被推薦人
  status TEXT DEFAULT 'pending', -- pending, completed, rewarded
  order_id TEXT,                 -- 觸發獎勵的訂單
  referrer_points INTEGER,       -- 推薦人獲得點數
  referee_points INTEGER,        -- 被推薦人獲得點數
  created_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  
  FOREIGN KEY (referrer_id) REFERENCES members(id),
  FOREIGN KEY (referee_id) REFERENCES members(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_id ON referrals(referee_id);

-- ===== Google 評價記錄 =====
CREATE TABLE IF NOT EXISTS google_reviews (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL UNIQUE,  -- 每人限一次
  screenshot_url TEXT,
  verified_at TEXT,
  verified_by TEXT,
  points_awarded INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE INDEX IF NOT EXISTS idx_google_reviews_member_id ON google_reviews(member_id);

-- ===== 作品集 =====
CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,         -- logo, namecard, menu, social, website
  client_name TEXT,
  industry TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  tags TEXT,                      -- JSON array
  featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_items(featured);
