// 添喜設計 - 風格參考資料
// 重要：這些是「設計風格參考」，不是套版模板
// 設計師會根據選擇的風格方向進行原創設計

export type StyleCategory = 
  | 'food'      // 餐飲美食
  | 'elegant'   // 優雅質感
  | 'minimal'   // 極簡現代
  | 'gaming'    // 動漫遊戲
  | 'vtuber'    // VTuber
  | 'badge'     // 徽章紋章
  | 'typo';     // 字體設計

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
  food: { label: '餐飲美食', emoji: '🍽️' },
  elegant: { label: '優雅質感', emoji: '👗' },
  minimal: { label: '極簡現代', emoji: '🔷' },
  gaming: { label: '動漫遊戲', emoji: '🎮' },
  vtuber: { label: 'VTuber', emoji: '🎭' },
  badge: { label: '徽章紋章', emoji: '🏅' },
  typo: { label: '字體設計', emoji: '✏️' }
};

// Logo 設計風格
export const logoStyles: DesignStyle[] = [
  // 🍽️ 餐飲美食
  {
    id: 'food-chinese',
    name: '中式餐飲',
    category: 'food',
    categoryLabel: '餐飲美食',
    description: '傳統元素結合現代設計，適合中式餐廳、小吃店、茶館',
    emoji: '🍜',
    tags: ['中式', '餐飲', '傳統', '食品'],
    forProducts: ['logo', 'menu', 'namecard']
  },
  {
    id: 'food-cafe',
    name: '咖啡甜點',
    category: 'food',
    categoryLabel: '餐飲美食',
    description: '溫馨舒適的咖啡廳風格，適合咖啡店、甜點店、烘焙坊',
    emoji: '☕',
    tags: ['咖啡', '甜點', '烘焙', '溫馨'],
    forProducts: ['logo', 'menu', 'namecard']
  },
  {
    id: 'food-japanese',
    name: '日式料理',
    category: 'food',
    categoryLabel: '餐飲美食',
    description: '簡潔優雅的日式風格，適合日本料理、拉麵店、居酒屋',
    emoji: '🍣',
    tags: ['日式', '和風', '料理', '簡潔'],
    forProducts: ['logo', 'menu', 'namecard']
  },
  
  // 👗 優雅質感
  {
    id: 'elegant-luxury',
    name: '奢華精品',
    category: 'elegant',
    categoryLabel: '優雅質感',
    description: '高端大氣的精品風格，適合時尚品牌、珠寶飾品、高級服務',
    emoji: '💎',
    tags: ['奢華', '精品', '高端', '時尚'],
    forProducts: ['logo', 'namecard']
  },
  {
    id: 'elegant-feminine',
    name: '柔美女性',
    category: 'elegant',
    categoryLabel: '優雅質感',
    description: '溫柔優雅的女性風格，適合美容美甲、花藝、女性用品',
    emoji: '🌸',
    tags: ['女性', '柔美', '優雅', '花卉'],
    forProducts: ['logo', 'namecard', 'social']
  },
  {
    id: 'elegant-artisan',
    name: '職人工藝',
    category: 'elegant',
    categoryLabel: '優雅質感',
    description: '手作質感的職人風格，適合工作室、手工藝品、設計師品牌',
    emoji: '🛠️',
    tags: ['職人', '手作', '工藝', '匠心'],
    forProducts: ['logo', 'namecard']
  },
  
  // 🔷 極簡現代
  {
    id: 'minimal-tech',
    name: '科技簡約',
    category: 'minimal',
    categoryLabel: '極簡現代',
    description: '俐落科技感設計，適合科技公司、App、新創企業',
    emoji: '🚀',
    tags: ['科技', '現代', '簡約', '俐落'],
    forProducts: ['logo', 'namecard', 'website']
  },
  {
    id: 'minimal-clean',
    name: '純淨極簡',
    category: 'minimal',
    categoryLabel: '極簡現代',
    description: '乾淨俐落的設計風格，適合任何追求簡潔形象的品牌',
    emoji: '⬜',
    tags: ['極簡', '乾淨', '現代', '簡潔'],
    forProducts: ['logo', 'namecard', 'website']
  },
  {
    id: 'minimal-geometric',
    name: '幾何構成',
    category: 'minimal',
    categoryLabel: '極簡現代',
    description: '幾何圖形構成的現代設計，適合建築、設計、創意產業',
    emoji: '🔷',
    tags: ['幾何', '現代', '結構', '理性'],
    forProducts: ['logo', 'namecard']
  },
  
  // 🎮 動漫遊戲
  {
    id: 'gaming-esports',
    name: '電競風格',
    category: 'gaming',
    categoryLabel: '動漫遊戲',
    description: '霸氣銳利的電競風格，適合遊戲戰隊、電競品牌、遊戲周邊',
    emoji: '🎮',
    tags: ['電競', '遊戲', '銳利', '動感'],
    forProducts: ['logo', 'social']
  },
  {
    id: 'gaming-anime',
    name: '動漫風格',
    category: 'gaming',
    categoryLabel: '動漫遊戲',
    description: '活潑可愛的動漫風格，適合動漫相關品牌、同人創作',
    emoji: '🌟',
    tags: ['動漫', '可愛', '日系', '活潑'],
    forProducts: ['logo', 'social']
  },
  {
    id: 'gaming-retro',
    name: '復古遊戲',
    category: 'gaming',
    categoryLabel: '動漫遊戲',
    description: '像素風或復古遊戲機風格，適合懷舊遊戲、獨立遊戲',
    emoji: '👾',
    tags: ['像素', '復古', '遊戲', '懷舊'],
    forProducts: ['logo', 'social']
  },
  
  // 🎭 VTuber
  {
    id: 'vtuber-cute',
    name: 'VTuber 可愛系',
    category: 'vtuber',
    categoryLabel: 'VTuber',
    description: '可愛風格的 VTuber Logo，適合走可愛路線的虛擬主播',
    emoji: '🎀',
    tags: ['VTuber', '可愛', '虛擬主播', '萌'],
    forProducts: ['logo', 'social']
  },
  {
    id: 'vtuber-cool',
    name: 'VTuber 酷炫系',
    category: 'vtuber',
    categoryLabel: 'VTuber',
    description: '帥氣酷炫的 VTuber Logo，適合走帥氣或神秘路線的虛擬主播',
    emoji: '🔥',
    tags: ['VTuber', '酷炫', '虛擬主播', '帥氣'],
    forProducts: ['logo', 'social']
  },
  {
    id: 'vtuber-fantasy',
    name: 'VTuber 奇幻系',
    category: 'vtuber',
    categoryLabel: 'VTuber',
    description: '奇幻魔法風格的 VTuber Logo，適合有世界觀設定的虛擬主播',
    emoji: '✨',
    tags: ['VTuber', '奇幻', '虛擬主播', '魔法'],
    forProducts: ['logo', 'social']
  },
  {
    id: 'vtuber-channel',
    name: 'VTuber 頻道設計',
    category: 'vtuber',
    categoryLabel: 'VTuber',
    description: '整體頻道品牌設計，包含 Logo、待機畫面風格參考',
    emoji: '📺',
    tags: ['VTuber', '頻道', '品牌', '直播'],
    forProducts: ['logo', 'social']
  },
  
  // 🏅 徽章紋章
  {
    id: 'badge-classic',
    name: '經典徽章',
    category: 'badge',
    categoryLabel: '徽章紋章',
    description: '經典圓形或盾形徽章，適合學校、社團、運動隊伍',
    emoji: '🛡️',
    tags: ['徽章', '經典', '圓形', '盾形'],
    forProducts: ['logo', 'namecard']
  },
  {
    id: 'badge-heraldry',
    name: '紋章風格',
    category: 'badge',
    categoryLabel: '徽章紋章',
    description: '歐式紋章風格，適合高端品牌、家族企業、精緻產品',
    emoji: '🏅',
    tags: ['紋章', '歐式', '高端', '傳統'],
    forProducts: ['logo', 'namecard']
  },
  {
    id: 'badge-stamp',
    name: '印章風格',
    category: 'badge',
    categoryLabel: '徽章紋章',
    description: '復古印章風格，適合文創品牌、手工製品、認證標誌',
    emoji: '🔖',
    tags: ['印章', '復古', '文創', '認證'],
    forProducts: ['logo', 'namecard']
  },
  
  // ✏️ 字體設計
  {
    id: 'typo-script',
    name: '手寫字體',
    category: 'typo',
    categoryLabel: '字體設計',
    description: '手寫感的字體 Logo，適合個人品牌、藝術家、文創',
    emoji: '✒️',
    tags: ['手寫', '字體', '個人', '藝術'],
    forProducts: ['logo', 'namecard']
  },
  {
    id: 'typo-modern',
    name: '現代字標',
    category: 'typo',
    categoryLabel: '字體設計',
    description: '現代感的純文字 Logo，適合企業、科技公司、專業服務',
    emoji: '🔤',
    tags: ['字標', '現代', '企業', '專業'],
    forProducts: ['logo', 'namecard', 'website']
  },
  {
    id: 'typo-decorative',
    name: '裝飾字體',
    category: 'typo',
    categoryLabel: '字體設計',
    description: '具有裝飾性的特殊字體設計，適合需要獨特識別度的品牌',
    emoji: '🎨',
    tags: ['裝飾', '特殊', '獨特', '創意'],
    forProducts: ['logo', 'namecard']
  },
  {
    id: 'typo-chinese',
    name: '中文字標',
    category: 'typo',
    categoryLabel: '字體設計',
    description: '中文字體設計的 Logo，適合強調在地文化或中文品牌名',
    emoji: '漢',
    tags: ['中文', '字標', '在地', '文化'],
    forProducts: ['logo', 'namecard']
  }
];
