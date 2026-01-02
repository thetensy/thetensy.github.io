// 添喜設計 - 產品與價格資料
// 這個檔案定義所有產品類型、方案、價格

export const products = {
  logo: {
    id: 'logo',
    name: 'Logo 設計',
    emoji: '🎨',
    description: '專屬品牌識別，讓顧客一眼記住你',
    available: true,
    plans: {
      basic: {
        name: '基礎版',
        price: 990,
        deliveryDays: 3,
        revisions: 1,
        formats: ['PNG'],
        description: '適合剛起步的小店'
      },
      pro: {
        name: '專業版',
        price: 1680,
        deliveryDays: 2,
        revisions: 3,
        formats: ['PNG', 'AI 向量檔'],
        description: '可用於印刷、招牌製作',
        recommended: true
      }
    }
  },
  
  namecard: {
    id: 'namecard',
    name: '名片設計',
    emoji: '💼',
    description: '專業名片，提升品牌形象',
    available: false, // 開發中
    comingSoon: true,
    plans: {}
  },
  
  dm: {
    id: 'dm',
    name: 'DM 傳單',
    emoji: '📄',
    description: '吸睛傳單，有效宣傳',
    available: false,
    comingSoon: true,
    plans: {}
  },
  
  social: {
    id: 'social',
    name: '社群圖片',
    emoji: '📱',
    description: 'IG、FB 貼文與限動設計',
    available: false,
    comingSoon: true,
    plans: {}
  },
  
  menu: {
    id: 'menu',
    name: '菜單設計',
    emoji: '🍽️',
    description: '精美菜單，提升點餐體驗',
    available: false,
    comingSoon: true,
    plans: {}
  },
  
  website: {
    id: 'website',
    name: '網站設計',
    emoji: '🌐',
    description: '簡潔單頁網站，建立線上門面',
    available: true,
    plans: {
      basic: {
        name: '單頁網站',
        price: 5000,
        deliveryDays: 7,
        revisions: 2,
        formats: ['線上網站'],
        description: '一頁式形象網站'
      },
      hosting: {
        name: '年度託管',
        price: 3000,
        isAddon: true, // 這是加購項目
        description: '我們幫你維護，網域自理',
        note: '一年後未續費將下架'
      }
    }
  }
};

// 產業類型選項
export const industries = [
  { value: 'restaurant', label: '餐飲美食', emoji: '🍜' },
  { value: 'cafe', label: '咖啡茶飲', emoji: '☕' },
  { value: 'retail', label: '零售商店', emoji: '🛍️' },
  { value: 'beauty', label: '美容美髮', emoji: '💇' },
  { value: 'fitness', label: '運動健身', emoji: '💪' },
  { value: 'medical', label: '醫療健康', emoji: '🏥' },
  { value: 'education', label: '教育培訓', emoji: '📚' },
  { value: 'tech', label: '科技服務', emoji: '💻' },
  { value: 'creative', label: '創意設計', emoji: '🎨' },
  { value: 'other', label: '其他', emoji: '✨' }
];

// 社群尺寸選項（多選）
export const socialSizes = [
  { id: 'ig-post', label: 'IG 貼文', size: '1080×1080' },
  { id: 'ig-story', label: 'IG 限動', size: '1080×1920' },
  { id: 'fb-post', label: 'FB 貼文', size: '1200×630' },
  { id: 'fb-cover', label: 'FB 封面', size: '820×312' },
  { id: 'line-rich', label: 'LINE 圖文選單', size: '2500×1686' }
];

// 主色選項
export const colorOptions = [
  { id: 'red', label: '紅色系', hex: '#E74C3C' },
  { id: 'orange', label: '橘色系', hex: '#E67E22' },
  { id: 'yellow', label: '黃色系', hex: '#F1C40F' },
  { id: 'green', label: '綠色系', hex: '#27AE60' },
  { id: 'teal', label: '青色系', hex: '#00B4A0' },
  { id: 'blue', label: '藍色系', hex: '#3498DB' },
  { id: 'purple', label: '紫色系', hex: '#9B59B6' },
  { id: 'pink', label: '粉色系', hex: '#E91E8C' },
  { id: 'brown', label: '棕色系', hex: '#795548' },
  { id: 'dark', label: '深色系', hex: '#2C3E50' },
  { id: 'designer', label: '交給設計師', hex: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', isGradient: true }
];

// Upsell 提示
export const upsells = {
  cis: {
    title: '需要完整品牌規範？',
    description: '我們也提供專業的 CIS/VI 企業識別設計',
    price: '9,900 起',
    cta: '了解更多',
    link: '/services/cis'
  }
};

// 急件設定
export const rushOrder = {
  enabled: true,
  message: '急件費用依實際情況報價，請透過 LINE 與我們聯繫',
  lineUrl: 'https://line.me/ti/p/@tensy'
};
