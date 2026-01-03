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

// 作品集資料
export const portfolioItems: PortfolioItem[] = [
  // ===== 餐飲美食 =====
  {
    id: 'laochang-beef-noodle',
    title: '老張牛肉麵',
    category: 'logo',
    industry: '餐飲',
    description: '傳統與現代結合的中式餐飲品牌識別',
    image: '/portfolio/logo-laochang-beef-noodle.webp',
    tags: ['中式餐飲', '傳統', '牛肉麵'],
    featured: true,
    createdAt: '2026-01-03'
  },
  {
    id: 'tensy-brew',
    title: '天喜 Tensy Brew',
    category: 'logo',
    industry: '餐飲',
    description: '北歐極簡風格的咖啡廳品牌設計',
    image: '/portfolio/logo-tensy-brew.webp',
    tags: ['咖啡廳', '極簡', '北歐風'],
    featured: true,
    createdAt: '2026-01-03'
  },
  {
    id: 'kawashi-sushi',
    title: '川石壽司',
    category: 'logo',
    industry: '餐飲',
    description: '和風優雅的日式壽司店品牌設計',
    image: '/portfolio/logo-kawashi-sushi.webp',
    tags: ['日式', '壽司', '和風'],
    featured: true,
    createdAt: '2026-01-03'
  },
  {
    id: 'rex-royal-bake',
    title: 'Rex Royal Bake 雷克斯皇家烘焙',
    category: 'logo',
    industry: '餐飲',
    description: '高級麵包店品牌，紋章風格設計',
    image: '/portfolio/logo-rex-royal-bake.webp',
    tags: ['烘焙', '紋章', '高端'],
    featured: true,
    createdAt: '2026-01-03'
  },
  {
    id: 'magic-dessert',
    title: '魔法甜點屋',
    category: 'logo',
    industry: '餐飲',
    description: '夢幻可愛的甜點店品牌設計',
    image: '/portfolio/logo-magic-dessert.webp',
    tags: ['甜點', '可愛', '夢幻'],
    featured: false,
    createdAt: '2026-01-03'
  },
  {
    id: 'chengji-tea',
    title: '誠記茶莊',
    category: 'logo',
    industry: '餐飲',
    description: '傳統茶行品牌，復古圓形印章造型',
    image: '/portfolio/logo-chengji-tea.webp',
    tags: ['茶行', '印章', '傳統'],
    featured: false,
    createdAt: '2026-01-03'
  },
  
  // ===== 優雅質感 =====
  {
    id: 'lumiere-jewelry',
    title: 'LUMIÈRE 珠寶',
    category: 'logo',
    industry: '精品',
    description: '高端珠寶品牌，鑽石切面幾何設計',
    image: '/portfolio/logo-lumiere-jewelry.webp',
    tags: ['珠寶', '奢華', '精品'],
    featured: true,
    createdAt: '2026-01-03'
  },
  {
    id: 'hanami-nail',
    title: '花見美甲 HANAMI',
    category: 'logo',
    industry: '美容',
    description: '女性美甲沙龍品牌，櫻花花瓣元素',
    image: '/portfolio/logo-hanami-nail.webp',
    tags: ['美甲', '女性', '櫻花'],
    featured: true,
    createdAt: '2026-01-03'
  },
  {
    id: 'hikari-florist',
    title: '光之花藝',
    category: 'logo',
    industry: '花藝',
    description: '花店品牌，手寫書法風格文字',
    image: '/portfolio/logo-hikari-florist.webp',
    tags: ['花店', '手寫', '文青'],
    featured: false,
    createdAt: '2026-01-03'
  },
  {
    id: 'mokukou-studio',
    title: '木光工作室',
    category: 'logo',
    industry: '手作',
    description: '手作木工品牌，木紋與工具設計',
    image: '/portfolio/logo-mokukou-studio.webp',
    tags: ['木工', '手作', '職人'],
    featured: false,
    createdAt: '2026-01-03'
  },
  
  // ===== 極簡現代 =====
  {
    id: 'nexo-tech',
    title: 'NEXO 科技',
    category: 'logo',
    industry: '科技',
    description: '科技新創公司品牌，抽象字母變形',
    image: '/portfolio/logo-nexo-tech.webp',
    tags: ['科技', '新創', '現代'],
    featured: true,
    createdAt: '2026-01-03'
  },
  {
    id: 'jing-select',
    title: '淨 JING 生活選物',
    category: 'logo',
    industry: '零售',
    description: '生活選物店品牌，極簡文字設計',
    image: '/portfolio/logo-jing-select.webp',
    tags: ['選物店', '極簡', '生活'],
    featured: true,
    createdAt: '2026-01-03'
  },
  {
    id: 'fangyuan-office',
    title: '方圓之間事務所',
    category: 'logo',
    industry: '專業服務',
    description: '事務所品牌，圓形與方形幾何構成',
    image: '/portfolio/logo-fangyuan-office.webp',
    tags: ['事務所', '幾何', '專業'],
    featured: false,
    createdAt: '2026-01-03'
  },
  {
    id: 'modo-design',
    title: 'MODO 設計顧問',
    category: 'logo',
    industry: '設計',
    description: '設計顧問公司品牌，現代無襯線字標',
    image: '/portfolio/logo-modo-design.webp',
    tags: ['設計', '顧問', '字標'],
    featured: false,
    createdAt: '2026-01-03'
  },
  {
    id: 'shanhai-bookstore',
    title: '山海書店',
    category: 'logo',
    industry: '零售',
    description: '獨立書店品牌，中文字體設計',
    image: '/portfolio/logo-shanhai-bookstore.webp',
    tags: ['書店', '中文', '獨立'],
    featured: false,
    createdAt: '2026-01-03'
  },
  
  // ===== 動漫遊戲 =====
  {
    id: 'shadow-wolves',
    title: 'Shadow Wolves 暗影狼',
    category: 'logo',
    industry: '電競',
    description: '電競戰隊品牌，狼頭銳利設計',
    image: '/portfolio/logo-shadow-wolves.webp',
    tags: ['電競', '戰隊', '狼'],
    featured: true,
    createdAt: '2026-01-03'
  },
  {
    id: 'starry-animation',
    title: '星辰動畫',
    category: 'logo',
    industry: '娛樂',
    description: '動畫工作室品牌，日系活潑風格',
    image: '/portfolio/logo-starry-animation.webp',
    tags: ['動畫', '工作室', '日系'],
    featured: false,
    createdAt: '2026-01-03'
  },
  {
    id: 'pixel-arcade',
    title: 'PIXEL ARCADE',
    category: 'logo',
    industry: '娛樂',
    description: '復古遊戲品牌，像素風格設計',
    image: '/portfolio/logo-pixel-arcade.webp',
    tags: ['遊戲', '像素', '復古'],
    featured: false,
    createdAt: '2026-01-03'
  },
  
  // ===== VTuber =====
  {
    id: 'yaori-vtuber',
    title: '夜織花兒',
    category: 'logo',
    industry: '娛樂',
    description: 'VTuber 虛擬主播品牌，奇幻風格',
    image: '/portfolio/logo-yaori-vtuber.webp',
    tags: ['VTuber', '虛擬主播', '奇幻'],
    featured: true,
    createdAt: '2026-01-03'
  },
  
  // ===== 徽章紋章 =====
  {
    id: 'blazer-moto',
    title: '峰雷 Blazer 摩托車社團',
    category: 'logo',
    industry: '社團',
    description: '摩托車社團品牌，復古機車徽章設計',
    image: '/portfolio/logo-blazer-moto.webp',
    tags: ['摩托車', '徽章', '社團'],
    featured: true,
    createdAt: '2026-01-03'
  }
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
