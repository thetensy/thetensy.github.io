// 添喜設計 - 風格參考資料
// 重要：這些是「設計風格參考」，不是套版模板
// 設計師會根據選擇的風格方向進行原創設計

export type StyleCategory = 
  | 'food'      // 餐飲美食
  | 'elegant'   // 優雅質感
  | 'tech'      // 科技現代
  | 'retro'     // 復古懷舊
  | 'minimal'   // 極簡風格
  | 'natural'   // 自然有機
  | 'playful';  // 活潑可愛

export interface DesignStyle {
  id: string;
  name: string;           // 風格名稱
  category: StyleCategory;
  categoryLabel: string;  // 分類顯示名稱
  description: string;    // 風格描述
  reference?: string;     // 參考作品名稱（選填）
  emoji: string;          // 代表 emoji（之後換成真實作品圖）
  tags: string[];         // 搜尋用標籤
  forProducts: string[];  // 適用的產品類型
}

export const styleCategories: Record<StyleCategory, { label: string; emoji: string }> = {
  food: { label: '餐飲美食', emoji: '🍜' },
  elegant: { label: '優雅質感', emoji: '👗' },
  tech: { label: '科技現代', emoji: '🚀' },
  retro: { label: '復古懷舊', emoji: '📻' },
  minimal: { label: '極簡風格', emoji: '⬜' },
  natural: { label: '自然有機', emoji: '🌿' },
  playful: { label: '活潑可愛', emoji: '🧸' }
};

// Logo 設計風格
export const logoStyles: DesignStyle[] = [
  {
    id: 'retro-chinese',
    name: '復古中式',
    category: 'retro',
    categoryLabel: '復古懷舊',
    description: '傳統元素結合現代設計，適合中式餐飲、茶行',
    reference: '南門美食閣',
    emoji: '🍜',
    tags: ['中式', '傳統', '復古', '餐飲'],
    forProducts: ['logo', 'menu', 'namecard']
  },
  {
    id: 'tech-future',
    name: '科技未來',
    category: 'tech',
    categoryLabel: '科技現代',
    description: '俐落線條、幾何造型，適合科技公司、新創',
    reference: '雲端科技',
    emoji: '🚀',
    tags: ['科技', '現代', '幾何', '新創'],
    forProducts: ['logo', 'namecard', 'website']
  },
  {
    id: 'japanese-minimal',
    name: '日式極簡',
    category: 'minimal',
    categoryLabel: '極簡風格',
    description: '留白美學、簡約優雅，適合咖啡廳、選物店',
    reference: '花見咖啡',
    emoji: '🌸',
    tags: ['日式', '極簡', '優雅', '咖啡'],
    forProducts: ['logo', 'menu', 'social']
  },
  {
    id: 'ink-wash',
    name: '水墨風格',
    category: 'elegant',
    categoryLabel: '優雅質感',
    description: '東方水墨意境，適合茶館、藝文空間',
    reference: '山海軒',
    emoji: '🎋',
    tags: ['水墨', '東方', '藝術', '茶'],
    forProducts: ['logo', 'menu', 'namecard']
  },
  {
    id: 'warm-handcraft',
    name: '溫暖手繪',
    category: 'playful',
    categoryLabel: '活潑可愛',
    description: '手繪質感、溫馨可愛，適合烘焙、手作品牌',
    reference: '晨光烘焙',
    emoji: '🥐',
    tags: ['手繪', '溫暖', '烘焙', '可愛'],
    forProducts: ['logo', 'menu', 'social']
  },
  {
    id: 'organic-natural',
    name: '自然有機',
    category: 'natural',
    categoryLabel: '自然有機',
    description: '綠色、有機感，適合健康食品、農產品牌',
    reference: '綠野鮮蔬',
    emoji: '🌿',
    tags: ['自然', '有機', '健康', '綠色'],
    forProducts: ['logo', 'dm', 'social']
  },
  {
    id: 'neon-bar',
    name: '霓虹酒吧',
    category: 'playful',
    categoryLabel: '活潑可愛',
    description: '霓虹色彩、夜生活風格，適合酒吧、夜店',
    reference: '星月酒吧',
    emoji: '🍸',
    tags: ['霓虹', '酒吧', '夜店', '潮流'],
    forProducts: ['logo', 'social', 'dm']
  },
  {
    id: 'cute-dessert',
    name: '可愛插畫',
    category: 'playful',
    categoryLabel: '活潑可愛',
    description: '可愛插畫風格，適合甜點、兒童品牌',
    reference: '小熊甜點',
    emoji: '🧸',
    tags: ['可愛', '插畫', '甜點', '兒童'],
    forProducts: ['logo', 'menu', 'social']
  }
];

// 取得特定產品的可用風格
export function getStylesForProduct(productId: string): DesignStyle[] {
  return logoStyles.filter(style => style.forProducts.includes(productId));
}

// 根據分類篩選風格
export function getStylesByCategory(category: StyleCategory | 'all'): DesignStyle[] {
  if (category === 'all') return logoStyles;
  return logoStyles.filter(style => style.category === category);
}
