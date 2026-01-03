// 添喜設計 - 作品集資料
// 之後可以改成從 D1 或 R2 讀取

export interface PortfolioItem {
  id: string;
  title: string;           // 作品標題
  category: string;        // 分類：logo, namecard, menu, social, website
  client?: string;         // 客戶名稱（選填，可匿名）
  industry?: string;       // 產業
  description?: string;    // 作品描述
  image: string;           // 圖片路徑（之後改成 R2 URL）
  tags: string[];          // 標籤
  featured?: boolean;      // 是否精選
  createdAt: string;       // 建立日期
}

// 分類定義
export const portfolioCategories = {
  all: { label: '全部', emoji: '✨' },
  logo: { label: 'Logo 設計', emoji: '🎨' },
  namecard: { label: '名片設計', emoji: '💼' },
  menu: { label: '菜單設計', emoji: '🍽️' },
  social: { label: '社群圖片', emoji: '📱' },
  website: { label: '網站設計', emoji: '🌐' }
};

// 作品集資料（之後可以改成從 API 讀取）
// 圖片放在 /public/portfolio/ 資料夾
export const portfolioItems: PortfolioItem[] = [
  // ===== 範例資料 - 之後替換成真實作品 =====
  {
    id: 'sample-1',
    title: '花語茶館 Logo',
    category: 'logo',
    client: '花語茶館',
    industry: '餐飲',
    description: '結合花卉與茶葉元素的優雅 Logo 設計',
    image: '/portfolio/sample-logo-1.jpg',
    tags: ['餐飲', '茶飲', '優雅'],
    featured: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'sample-2',
    title: '科技新創 Logo',
    category: 'logo',
    client: '匿名客戶',
    industry: '科技',
    description: '簡潔現代的科技公司識別設計',
    image: '/portfolio/sample-logo-2.jpg',
    tags: ['科技', '極簡', '現代'],
    featured: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'sample-3',
    title: 'VTuber 頻道 Logo',
    category: 'logo',
    client: '虛擬主播',
    industry: '娛樂',
    description: '可愛風格的 VTuber 頻道識別',
    image: '/portfolio/sample-logo-3.jpg',
    tags: ['VTuber', '可愛', '直播'],
    featured: false,
    createdAt: '2026-01-01'
  }
  // 更多作品...
];

// 取得作品（支援篩選）
export function getPortfolioItems(category?: string, limit?: number): PortfolioItem[] {
  let items = [...portfolioItems];
  
  // 篩選分類
  if (category && category !== 'all') {
    items = items.filter(item => item.category === category);
  }
  
  // 排序：精選優先，然後按日期
  items.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // 限制數量
  if (limit) {
    items = items.slice(0, limit);
  }
  
  return items;
}
