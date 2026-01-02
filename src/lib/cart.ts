// 添喜設計 - 購物車系統
// 使用 localStorage 儲存購物車狀態

export interface CartItem {
  id: string;              // 唯一識別碼
  productType: string;     // 產品類型：logo, namecard, website...
  productName: string;     // 產品名稱
  styleId: string;         // 選擇的風格
  styleName: string;       // 風格名稱
  planId: string;          // 方案：basic, pro
  planName: string;        // 方案名稱
  price: number;           // 單價
  quantity: number;        // 數量
  brandName: string;       // 品牌名稱
  industry?: string;       // 產業
  primaryColor?: string;   // 主色
  notes?: string;          // 備註
  addedAt: string;         // 加入時間
}

export interface CartState {
  items: CartItem[];
  updatedAt: string;
}

const CART_KEY = 'tensy_cart';

// 取得購物車
export function getCart(): CartState {
  if (typeof window === 'undefined') {
    return { items: [], updatedAt: new Date().toISOString() };
  }
  
  try {
    const data = localStorage.getItem(CART_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse cart:', e);
  }
  
  return { items: [], updatedAt: new Date().toISOString() };
}

// 儲存購物車
export function saveCart(cart: CartState): void {
  if (typeof window === 'undefined') return;
  
  cart.updatedAt = new Date().toISOString();
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  
  // 觸發自訂事件，讓其他元件知道購物車更新了
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
}

// 加入購物車
export function addToCart(item: Omit<CartItem, 'id' | 'addedAt'>): CartItem {
  const cart = getCart();
  
  const newItem: CartItem = {
    ...item,
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    addedAt: new Date().toISOString()
  };
  
  cart.items.push(newItem);
  saveCart(cart);
  
  return newItem;
}

// 移除購物車項目
export function removeFromCart(itemId: string): void {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.id !== itemId);
  saveCart(cart);
}

// 更新購物車項目
export function updateCartItem(itemId: string, updates: Partial<CartItem>): void {
  const cart = getCart();
  const index = cart.items.findIndex(item => item.id === itemId);
  
  if (index !== -1) {
    cart.items[index] = { ...cart.items[index], ...updates };
    saveCart(cart);
  }
}

// 清空購物車
export function clearCart(): void {
  saveCart({ items: [], updatedAt: new Date().toISOString() });
}

// 計算小計
export function getSubtotal(): number {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// 計算折扣後金額
export function getTotal(discountRate: number = 1): number {
  return Math.round(getSubtotal() * discountRate);
}

// 取得購物車數量
export function getCartCount(): number {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

// 格式化價格
export function formatPrice(price: number): string {
  return price.toLocaleString('zh-TW');
}
