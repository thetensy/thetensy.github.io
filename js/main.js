// ===== 添喜設計 - Main JavaScript =====

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initCursorGlow();
  initCategoryFilter();
  initStyleTags();
  initModal();
  initProductCards();
});

// ===== 鼠標光暈效果 =====
function initCursorGlow() {
  // 創建光暈元素
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, rgba(78, 205, 196, 0.2) 50%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 9998;
    transition: opacity 0.3s ease;
    mix-blend-mode: screen;
  `;
  
  const glowLarge = document.createElement('div');
  glowLarge.className = 'cursor-glow-large';
  glowLarge.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 205, 86, 0.15) 0%, rgba(78, 205, 196, 0.1) 40%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 9997;
    transition: all 0.15s ease-out;
  `;
  
  document.body.appendChild(glowLarge);
  document.body.appendChild(glow);
  
  // 跟隨鼠標
  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    
    setTimeout(function() {
      glowLarge.style.left = e.clientX + 'px';
      glowLarge.style.top = e.clientY + 'px';
    }, 50);
  });
}

// ===== 分類篩選 (設計列表頁) =====
function initCategoryFilter() {
  const categoryItems = document.querySelectorAll('.category-item');
  
  categoryItems.forEach(item => {
    item.addEventListener('click', function() {
      // 移除所有 active
      categoryItems.forEach(i => i.classList.remove('active'));
      // 加上 active
      this.classList.add('active');
      
      // 這裡可以加上篩選邏輯
      const category = this.dataset.category;
      filterProducts(category);
    });
  });
}

// ===== 風格標籤篩選 =====
function initStyleTags() {
  const styleTags = document.querySelectorAll('.style-tag');
  
  styleTags.forEach(tag => {
    tag.addEventListener('click', function() {
      // Toggle active
      this.classList.toggle('active');
      
      // 這裡可以加上篩選邏輯
      const style = this.dataset.style;
      // filterByStyle(style);
    });
  });
}

// ===== 產品篩選 =====
function filterProducts(category) {
  const products = document.querySelectorAll('.product-card');
  
  products.forEach(product => {
    if (category === 'all' || product.dataset.category === category) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// ===== Modal =====
function initModal() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloses = document.querySelectorAll('.modal-close');
  
  // 開啟 Modal
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const modalId = this.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // 關閉 Modal - 點擊關閉按鈕
  modalCloses.forEach(close => {
    close.addEventListener('click', function() {
      const modal = this.closest('.modal-overlay');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // 關閉 Modal - 點擊背景
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // 關閉 Modal - ESC 鍵
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => {
        overlay.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
}

// ===== 產品卡片點擊 =====
function initProductCards() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    card.addEventListener('click', function() {
      // 可以跳轉到詳情頁或開啟 Modal
      const productId = this.dataset.id;
      const productName = this.querySelector('h3').textContent;
      const productStyle = this.querySelector('.product-info p').textContent;
      const productPrice = this.querySelector('.product-price').textContent;
      
      // 開啟 LINE 諮詢（簡單版）
      // window.open('https://line.me/R/ti/p/@tensy', '_blank');
      
      // 或顯示詳情 Modal
      showProductModal(productName, productStyle, productPrice);
    });
  });
}

// ===== 顯示產品 Modal =====
function showProductModal(name, style, price) {
  // 簡單版：直接用 alert 或跳轉
  // 進階版可以動態創建 Modal
  
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.querySelector('.product-modal-name').textContent = name;
    modal.querySelector('.product-modal-style').textContent = style;
    modal.querySelector('.product-modal-price').textContent = price;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// ===== 平滑滾動 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// ===== 動畫觸發 (滾動時) =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ===== LINE 諮詢按鈕 =====
function openLineChat() {
  window.open('https://line.me/R/ti/p/@tensy', '_blank');
}
