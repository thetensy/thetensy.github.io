// 添喜設計 - 折扣點數系統
// 點數規則：1 點 = 1 元，每筆訂單最多折抵 50%

export interface PointTransaction {
  id: string;
  memberId: string;
  type: 'earn' | 'redeem' | 'expire' | 'adjust';
  amount: number;          // 正數=獲得，負數=扣除
  balance: number;         // 交易後餘額
  source: PointSource;     // 點數來源
  orderId?: string;        // 關聯訂單（選填）
  description: string;     // 說明
  expiresAt?: string;      // 到期日（選填）
  createdAt: string;
}

export type PointSource = 
  | 'google_review'    // Google 評價
  | 'referral'         // 推薦好友
  | 'birthday'         // 生日禮
  | 'first_order'      // 首次下單
  | 'order_cashback'   // 訂單回饋
  | 'redeem'           // 折抵消費
  | 'manual_adjust'    // 手動調整
  | 'expired';         // 過期失效

// 點數獲取規則
export const POINT_RULES = {
  // Google 評價獎勵
  googleReview: {
    points: 100,
    description: 'Google 評價獎勵',
    requiresVerification: true,  // 需要截圖驗證
    maxPerMember: 1              // 每人限領一次
  },
  
  // 推薦好友獎勵（被推薦人完成首次訂單後發放）
  referral: {
    referrerPoints: 200,         // 推薦人獲得
    refereePoints: 100,          // 被推薦人獲得
    description: '推薦好友獎勵',
    requiresOrderCompletion: true
  },
  
  // 生日禮（每年一次）
  birthday: {
    points: 50,
    description: '生日禮',
    validDays: 30                // 生日月內可領取
  },
  
  // 首次下單獎勵
  firstOrder: {
    points: 50,
    description: '首次下單獎勵'
  }
};

// 點數使用規則
export const REDEEM_RULES = {
  maxRedeemPercent: 50,        // 每筆訂單最多折抵 50%
  minPointsToRedeem: 100,      // 最低使用門檻
  pointValue: 1,               // 1 點 = 1 元
  expirationMonths: 12,        // 點數有效期 12 個月
  nonTransferable: true,       // 不可轉讓
  nonCashable: true            // 不可換現金
};

// 計算可折抵點數
export function calculateRedeemablePoints(
  orderTotal: number,
  availablePoints: number
): {
  maxRedeemable: number;
  discount: number;
  remaining: number;
} {
  // 最大可折抵金額 = 訂單金額 × 50%
  const maxDiscount = Math.floor(orderTotal * (REDEEM_RULES.maxRedeemPercent / 100));
  
  // 實際可折抵點數（取 available 和 maxDiscount 的較小值）
  const maxRedeemable = Math.min(availablePoints, maxDiscount);
  
  // 必須達到最低使用門檻
  const canRedeem = maxRedeemable >= REDEEM_RULES.minPointsToRedeem;
  
  return {
    maxRedeemable: canRedeem ? maxRedeemable : 0,
    discount: canRedeem ? maxRedeemable * REDEEM_RULES.pointValue : 0,
    remaining: availablePoints - (canRedeem ? maxRedeemable : 0)
  };
}

// 點數餘額管理（localStorage 暫存，之後改 D1）
const POINTS_KEY = 'tensy_member_points';

export interface MemberPoints {
  memberId: string;
  balance: number;
  transactions: PointTransaction[];
  lastUpdated: string;
}

// 取得會員點數
export function getMemberPoints(memberId: string): MemberPoints | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(POINTS_KEY);
  if (!data) return null;
  
  const allPoints: Record<string, MemberPoints> = JSON.parse(data);
  return allPoints[memberId] || null;
}

// 初始化會員點數
export function initMemberPoints(memberId: string): MemberPoints {
  const memberPoints: MemberPoints = {
    memberId,
    balance: 0,
    transactions: [],
    lastUpdated: new Date().toISOString()
  };
  
  saveMemberPoints(memberPoints);
  return memberPoints;
}

// 儲存會員點數
function saveMemberPoints(memberPoints: MemberPoints): void {
  if (typeof window === 'undefined') return;
  
  const data = localStorage.getItem(POINTS_KEY);
  const allPoints: Record<string, MemberPoints> = data ? JSON.parse(data) : {};
  
  allPoints[memberPoints.memberId] = memberPoints;
  localStorage.setItem(POINTS_KEY, JSON.stringify(allPoints));
}

// 新增點數交易
export function addPointTransaction(
  memberId: string,
  type: PointTransaction['type'],
  amount: number,
  source: PointSource,
  description: string,
  orderId?: string,
  expiresAt?: string
): PointTransaction {
  let memberPoints = getMemberPoints(memberId);
  
  if (!memberPoints) {
    memberPoints = initMemberPoints(memberId);
  }
  
  const newBalance = memberPoints.balance + amount;
  
  const transaction: PointTransaction = {
    id: `pt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    memberId,
    type,
    amount,
    balance: newBalance,
    source,
    orderId,
    description,
    expiresAt,
    createdAt: new Date().toISOString()
  };
  
  memberPoints.balance = newBalance;
  memberPoints.transactions.unshift(transaction); // 最新在前
  memberPoints.lastUpdated = new Date().toISOString();
  
  saveMemberPoints(memberPoints);
  
  return transaction;
}

// 獲得 Google 評價點數
export function earnGoogleReviewPoints(memberId: string): PointTransaction | null {
  const memberPoints = getMemberPoints(memberId);
  
  // 檢查是否已領取過
  if (memberPoints) {
    const hasEarned = memberPoints.transactions.some(
      t => t.source === 'google_review' && t.type === 'earn'
    );
    if (hasEarned) return null; // 已領取過
  }
  
  // 計算到期日（12 個月後）
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + REDEEM_RULES.expirationMonths);
  
  return addPointTransaction(
    memberId,
    'earn',
    POINT_RULES.googleReview.points,
    'google_review',
    POINT_RULES.googleReview.description,
    undefined,
    expiresAt.toISOString()
  );
}

// 折抵點數
export function redeemPoints(
  memberId: string,
  amount: number,
  orderId: string
): PointTransaction | null {
  const memberPoints = getMemberPoints(memberId);
  
  if (!memberPoints || memberPoints.balance < amount) {
    return null;
  }
  
  return addPointTransaction(
    memberId,
    'redeem',
    -amount, // 負數表示扣除
    'redeem',
    `訂單折抵 ${amount} 點`,
    orderId
  );
}

// 格式化點數顯示
export function formatPoints(points: number): string {
  return points.toLocaleString('zh-TW');
}
