// 添喜設計 - 會員系統
// 會員等級與儲值功能

export type MemberTier = 'basic' | 'silver' | 'gold' | 'platinum';

export interface MemberTierInfo {
  id: MemberTier;
  name: string;
  nameEn: string;
  minDeposit: number;      // 累計儲值門檻
  discountRate: number;    // 折扣率（0.85 = 85折）
  discountLabel: string;   // 折扣顯示
  color: string;           // 主題色
  benefits: string[];      // 會員特權
}

export interface Member {
  id: string;
  lineId?: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;         // LINE 大頭貼 URL
  balance: number;         // 目前餘額
  totalDeposit: number;    // 累計儲值金額
  tier: MemberTier;
  createdAt: string;
  updatedAt: string;
}

export interface DepositRecord {
  id: string;
  memberId: string;
  amount: number;
  method: 'bank_transfer';
  status: 'pending' | 'confirmed' | 'cancelled';
  bankAccount?: string;    // 匯款帳號末五碼
  invoiceNumber?: string;
  note?: string;
  createdAt: string;
  confirmedAt?: string;
}

// 會員等級設定
export const memberTiers: Record<MemberTier, MemberTierInfo> = {
  basic: {
    id: 'basic',
    name: '一般會員',
    nameEn: 'Basic',
    minDeposit: 0,
    discountRate: 1,
    discountLabel: '原價',
    color: '#6B7280',
    benefits: [
      '基本設計服務',
      '免費修改次數依方案'
    ]
  },
  silver: {
    id: 'silver',
    name: '銀卡會員',
    nameEn: 'Silver',
    minDeposit: 5000,
    discountRate: 0.95,
    discountLabel: '95折',
    color: '#9CA3AF',
    benefits: [
      '所有訂單 95 折',
      '優先製作排程',
      '免費修改 +1 次'
    ]
  },
  gold: {
    id: 'gold',
    name: '金卡會員',
    nameEn: 'Gold',
    minDeposit: 30000,
    discountRate: 0.9,
    discountLabel: '9折',
    color: '#F59E0B',
    benefits: [
      '所有訂單 9 折',
      '優先製作排程',
      '急件免加價',
      '免費修改 +2 次'
    ]
  },
  platinum: {
    id: 'platinum',
    name: '白金會員',
    nameEn: 'Platinum',
    minDeposit: 100000,
    discountRate: 0.85,
    discountLabel: '85折',
    color: '#8B5CF6',
    benefits: [
      '所有訂單 85 折',
      '專屬設計師服務',
      '最高優先製作',
      '急件免加價',
      '無限免費修改',
      'VIP 專線服務'
    ]
  }
};

// 根據累計儲值計算會員等級
export function calculateTier(totalDeposit: number): MemberTier {
  if (totalDeposit >= memberTiers.platinum.minDeposit) return 'platinum';
  if (totalDeposit >= memberTiers.gold.minDeposit) return 'gold';
  if (totalDeposit >= memberTiers.silver.minDeposit) return 'silver';
  return 'basic';
}

// 取得下一個等級資訊
export function getNextTier(currentTier: MemberTier): MemberTierInfo | null {
  const tierOrder: MemberTier[] = ['basic', 'silver', 'gold', 'platinum'];
  const currentIndex = tierOrder.indexOf(currentTier);
  
  if (currentIndex < tierOrder.length - 1) {
    return memberTiers[tierOrder[currentIndex + 1]];
  }
  
  return null;
}

// 計算升級還需要多少
export function getUpgradeAmount(totalDeposit: number): { nextTier: MemberTierInfo; needed: number } | null {
  const currentTier = calculateTier(totalDeposit);
  const nextTier = getNextTier(currentTier);
  
  if (nextTier) {
    return {
      nextTier,
      needed: nextTier.minDeposit - totalDeposit
    };
  }
  
  return null;
}

// 儲值金額選項（無贈送，純折扣制度）
export const depositOptions = [
  { amount: 1000, label: 'NT$ 1,000' },
  { amount: 3000, label: 'NT$ 3,000' },
  { amount: 5000, label: 'NT$ 5,000', highlight: '升級銀卡 95折' },
  { amount: 10000, label: 'NT$ 10,000' },
  { amount: 30000, label: 'NT$ 30,000', highlight: '升級金卡 9折' },
  { amount: 50000, label: 'NT$ 50,000' },
  { amount: 100000, label: 'NT$ 100,000', highlight: '升級白金 85折' }
];

// 銀行匯款資訊
export const bankInfo = {
  bankName: '國泰世華銀行',
  bankCode: '013',
  accountNumber: '000-00-000000-0', // 請替換成實際帳號
  accountName: '添喜設計',
  note: '匯款後請保留收據，並透過 LINE 告知帳號末五碼'
};

// 本地儲存會員資訊（簡易版，之後改成 API）
const MEMBER_KEY = 'tensy_member';

export function getMember(): Member | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(MEMBER_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse member:', e);
  }
  
  return null;
}

export function saveMember(member: Member): void {
  if (typeof window === 'undefined') return;
  
  member.updatedAt = new Date().toISOString();
  member.tier = calculateTier(member.totalDeposit);
  localStorage.setItem(MEMBER_KEY, JSON.stringify(member));
  
  window.dispatchEvent(new CustomEvent('member-updated', { detail: member }));
}

export function clearMember(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MEMBER_KEY);
  window.dispatchEvent(new CustomEvent('member-updated', { detail: null }));
}

// 取得會員折扣率
export function getMemberDiscount(): number {
  const member = getMember();
  if (!member) return 1;
  
  return memberTiers[member.tier].discountRate;
}
