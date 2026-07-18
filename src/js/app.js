/* eslint-disable */
/**
 * Smart Architect Engine v2.0 - Core Computational System
 * Bộ điều phối tích hợp tính toán chỉ số tối ưu hóa thiết bị định cấu hình thời gian thực (AOI)
 */

const CONFIG_CATALOG = {
  air_conditioner: [
    { id: 'ac-pana-01', name: 'Panasonic Inverter 1 HP CU/CS-XPU9XKH-8', price: 11490000, brand: 'Panasonic', capacity: 12, energyRating: 95, specMatch: 90 },
    { id: 'ac-daikin-02', name: 'Daikin Inverter 1.5 HP FTKB35WAVMV', price: 13990000, brand: 'Daikin', capacity: 18, energyRating: 92, specMatch: 85 },
    { id: 'ac-casper-03', name: 'Casper Inverter 1 HP TC-09IS35', price: 5890000, brand: 'Casper', capacity: 12, energyRating: 75, specMatch: 70 }
  ],
  refrigerator: [
    { id: 'rf-samsung-01', name: 'Samsung Inverter 236 lít RT22M4032BY/SV', price: 6490000, brand: 'Samsung', capacity: 3, energyRating: 88, specMatch: 80 },
    { id: 'rf-lg-02', name: 'Tủ lạnh LG Inverter 315 lít GN-D312PS', price: 8890000, brand: 'LG', capacity: 4, energyRating: 90, specMatch: 92 },
    { id: 'rf-aqua-03', name: 'Tủ lạnh Aqua 90 lít AQR-D99FA', price: 2790000, brand: 'Aqua', capacity: 1, energyRating: 60, specMatch: 65 }
  ],
  laptop: [
    { id: 'lt-hp-01', name: 'HP Pavilion 14-dv2073TU (Core i5 / 8GB RAM / 512GB SSD)', price: 14500000, brand: 'HP', performance: 'medium', energyRating: 80, specMatch: 85 },
    { id: 'lt-asus-02', name: 'Asus Vivobook 14 OLED (Core i5 / 8GB RAM / 512GB SSD)', price: 15200000, brand: 'Asus', performance: 'high', energyRating: 85, specMatch: 90 },
    { id: 'lt-lenovo-03', name: 'Lenovo IdeaPad Slim 3 (Core i5 / 16GB RAM / 512GB SSD)', price: 12900000, brand: 'Lenovo', performance: 'low', energyRating: 78, specMatch: 75 }
  ]
};

// COMPONENT 1: THE OPTIMIZATION PROGRESS ENGINE STATE MACHINE
let optimizationState = {
  currentCategory: null,
  constraints: {
    maxBudget: 30000000,
    roomCapacity: 15,
    userCount: 2,
    performanceRequirement: 'medium'
  },
  selectedProduct: null,
  calculatedMetrics: {
    budgetEfficiency: 0,
    utilityMatch: 0,
    sustainabilityScore: 0,
    totalAoi: 0
  }
};

let userExpertiseProfile = {
  tier: "Household Optimizer",
  totalOptimized: 14,
  xp: 2650
};

// Khởi chạy Module điều phối
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  if (form) form.addEventListener('submit', runExecutionFlow);
  initCollapsibleSidebarLogic();
  syncExpertiseWidgetUI();
});

function initCollapsibleSidebarLogic() {
  const panel = document.getElementById('sidebar-panel');
  const btnClose = document.getElementById('btn-close-sidebar');
  const btnOpen = document.getElementById('btn-open-sidebar');
  if (!panel || !btnClose || !btnOpen) return;

  btnClose.addEventListener('click', () => {
    panel.classList.remove('w-80', 'p-4');
    panel.classList.add('w-0', 'p-0', 'border-r-0', 'opacity-0', 'pointer-events-none');
    btnOpen.classList.remove('hidden');
  });
  btnOpen.addEventListener('click', () => {
    panel.classList.remove('w-0', 'p-0', 'border-r-0', 'opacity-0', 'pointer-events-none');
    panel.classList.add('w-80', 'p-4');
    btnOpen.classList.add('hidden');
  });
}

function syncExpertiseWidgetUI() {
  document.getElementById('user-tier-label').textContent = userExpertiseProfile.tier;
  document.getElementById('total-optimized-count').textContent = `${userExpertiseProfile.totalOptimized} cấu hình`;
}

// COMPONENT 2: INTERACTIVE PARAMETER ADJUSTERS ENGINE
window.triggerCategorySelection = function(category) {
  optimizationState.currentCategory = category;
  document.getElementById('active-category').textContent = category;
  document.getElementById('aoi-hud-overlay').classList.remove('hidden');

  appendSystemLog(`Phân hệ kết nối thành công: [${category.toUpperCase()}]. Vui lòng hiệu chỉnh thông số vật lý phòng máy.`);
  renderInlineSliders(category);
  recomputeAoiIndex();
};

function renderInlineSliders(category) {
  const chatBox = document.getElementById('chat-box');
  let configBlockHtml = `<div class="bg-brand-panel border border-brand-border p-4 font-mono text-xs w-full space-y-3 message-fade-in">
    <div class="text-brand-electric font-bold uppercase tracking-wider border-b border-brand-border pb-1">BẢNG HIỆU CHỈNH THÔNG SỐ VẬT LÝ</div>`;

  // Ngân sách mặc định cho mọi phân hệ
  configBlockHtml += `
    <div class="space-y-1">
      <div class="flex justify-between text-slate-400">
        <span>HẠN MỨC NGÂN SÁCH (VND)</span>
        <span id="slider-txt-budget" class="text-white font-bold">20,000,000</span>
      </div>
      <input type="range" min="5000000" max="40000000" step="500000" value="20000000"
        class="parameter-slider" oninput="window.updateSliderMetric('maxBudget', this.value, 'slider-txt-budget', true)">
    </div>`;

  if (category === 'air_conditioner') {
    configBlockHtml += `
      <div class="space-y-1">
        <div class="flex justify-between text-slate-400">
          <span>DIỆN TÍCH KHÔNG GIAN (m²)</span>
          <span id="slider-txt-room" class="text-white font-bold">15 m²</span>
        </div>
        <input type="range" min="8" max="40" step="1" value="15"
          class="parameter-slider" oninput="window.updateSliderMetric('roomCapacity', this.value, 'slider-txt-room', false, 'm²')">
      </div>`;
  } else if (category === 'refrigerator') {
    configBlockHtml += `
      <div class="space-y-1">
        <div class="flex justify-between text-slate-400">
          <span>SỐ THÀNH VIÊN SỬ DỤNG</span>
          <span id="slider-txt-users" class="text-white font-bold">3 nhân khẩu</span>
        </div>
        <input type="range" min="1" max="8" step="1" value="3"
          class="parameter-slider" oninput="window.updateSliderMetric('userCount', this.value, 'slider-txt-users', false, 'nhân khẩu')">
      </div>`;
  } else if (category === 'laptop') {
    configBlockHtml += `
      <div class="space-y-1">
        <div class="flex justify-between text-slate-400">
          <span>YÊU CẦU ĐỒ HỌA/HIỆU NĂNG</span>
          <span id="slider-txt-perf" class="text-white font-bold">Trung bình</span>
        </div>
        <input type="range" min="1" max="3" step="1" value="2"
          class="parameter-slider" oninput="window.updateSliderPerformance(this.value)">
      </div>`;
  }

  configBlockHtml += `
    <button onclick="window.executeParametricSearch()" class="w-full mt-2 bg-brand-border hover:bg-brand-cobalt border border-slate-600 text-white font-bold py-2 transition-all">
      [CHẠY THUẬT TOÁN LỌC KHO HÀNG THỜI GIAN THỰC]
    </button>
  </div>`;

  chatBox.insertAdjacentHTML('beforeend', configBlockHtml);
  scrollChatToBottom();
}

window.updateSliderMetric = function(key, val, textId, isCurrency, unit = '') {
  optimizationState.constraints[key] = parseInt(val, 10);
  if (isCurrency) {
    document.getElementById(textId).textContent = new Intl.NumberFormat('vi-VN').format(val);
  } else {
    document.getElementById(textId).textContent = `${val} ${unit}`;
  }
  recomputeAoiIndex();
};

window.updateSliderPerformance = function(val) {
  const map = { 1: 'low', 2: 'medium', 3: 'high' };
  const txtMap = { 1: 'Cơ bản (Văn phòng)', 2: 'Trung bình (Đa nhiệm)', 3: 'Cao (Đồ họa/Gaming)' };
  optimizationState.constraints.performanceRequirement = map[val];
  document.getElementById('slider-txt-perf').textContent = txtMap[val];
  recomputeAoiIndex();
};

// CHỈ SỐ LỰA CHỌN THUẬT TOÁN KỸ THUẬT THỜI GIAN THỰC (AOI ENGINE CALCULATOR)
function recomputeAoiIndex() {
  const constraints = optimizationState.constraints;
  const cat = optimizationState.currentCategory;
  if (!cat) return;

  const sampleProducts = CONFIG_CATALOG[cat];
  let targetProduct = optimizationState.selectedProduct || sampleProducts[0];

  // Tính hiệu quả ngân sách (Budget Efficiency)
  let budgetEff = 0;
  if (targetProduct.price <= constraints.maxBudget) {
    budgetEff = Math.round((targetProduct.price / constraints.maxBudget) * 100);
    if (budgetEff > 100) budgetEff = 100;
  } else {
    budgetEff = Math.max(10, Math.round(100 - ((targetProduct.price - constraints.maxBudget) / constraints.maxBudget) * 100));
  }

  // Tính mức tương thích nhu cầu (Utility Match)
  let utilMatch = 50;
  if (cat === 'air_conditioner') {
    const requiredCap = constraints.roomCapacity * 1;
    utilMatch = targetProduct.capacity >= requiredCap ? 95 : 45;
  } else if (cat === 'refrigerator') {
    utilMatch = targetProduct.capacity >= constraints.userCount ? 92 : 55;
  } else if (cat === 'laptop') {
    const perfMap = { 'low': 1, 'medium': 2, 'high': 3 };
    utilMatch = perfMap[targetProduct.performance] >= perfMap[constraints.performanceRequirement] ? 90 : 40;
  }

  // Tính chỉ số bền vững (Sustainability Factor)
  let sustainScore = targetProduct.energyRating;

  // Tính tổng điểm tích hợp trung bình trọng số
  let totalAoi = Math.round((budgetEff * 0.4) + (utilMatch * 0.35) + (sustainScore * 0.25));

  optimizationState.calculatedMetrics = {
    budgetEfficiency: budgetEff,
    utilityMatch: utilMatch,
    sustainabilityScore: sustainScore,
    totalAoi: totalAoi
  };

  // Cập nhật lên HUD
  document.getElementById('hud-total-aoi').textContent = `${totalAoi}/100`;
  document.getElementById('hud-val-budget').textContent = `${budgetEff}%`;
  document.getElementById('hud-bar-budget').style.width = `${budgetEff}%`;
  document.getElementById('hud-val-utility').textContent = `${utilMatch}%`;
  document.getElementById('hud-bar-utility').style.width = `${utilMatch}%`;
  document.getElementById('hud-val-sustainability').textContent = `${sustainScore}%`;
  document.getElementById('hud-bar-sustainability').style.width = `${sustainScore}%`;

  document.getElementById('slang-inspector').textContent = JSON.stringify(optimizationState);
}

// MECHANICAL PILLAR B: CONTEXTUAL SCENARIO QUESTS ENGINE
window.loadContextScenario = function(id) {
  document.getElementById('aoi-hud-overlay').classList.remove('hidden');
  if (id === 1) {
    optimizationState.currentCategory = 'air_conditioner';
    optimizationState.constraints = { maxBudget: 25000000, roomCapacity: 22, userCount: 4, performanceRequirement: 'medium' };
    appendUserSimulationLog("KÍCH HOẠT THỬ THÁCH_01: Tối ưu không gian sống căn hộ thông minh diện tích 22m2, hạn mức tài chính 25,000,000đ.");
    renderInlineSliders('air_conditioner');
  } else {
    optimizationState.currentCategory = 'laptop';
    optimizationState.constraints = { maxBudget: 14000000, roomCapacity: 10, userCount: 1, performanceRequirement: 'high' };
    appendUserSimulationLog("KÍCH HOẠT THỬ THÁCH_02: Trạm làm việc từ xa, yêu cầu đồ họa cao, ngân sách cực hạn 14,000,000đ.");
    renderInlineSliders('laptop');
  }
  document.getElementById('active-category').textContent = optimizationState.currentCategory;
  recomputeAoiIndex();
};

function runExecutionFlow(e) {
  if (e && e.preventDefault) e.preventDefault();
  const inputEl = document.getElementById('user-input');
  const query = inputEl.value.trim();
  if (!query) return;

  appendUserSimulationLog(query);
  inputEl.value = '';

  const latencyBox = document.getElementById('latency-val');
  const t0 = performance.now();

  // Trình phân tích từ khóa kỹ thuật (Heuristic Extraction Rule Base)
  setTimeout(() => {
    const lower = query.toLowerCase();
    if (lower.includes('máy lạnh') || lower.includes('điều hòa')) optimizationState.currentCategory = 'air_conditioner';
    if (lower.includes('tủ lạnh')) optimizationState.currentCategory = 'refrigerator';
    if (lower.includes('laptop') || lower.includes('máy tính')) optimizationState.currentCategory = 'laptop';

    if (optimizationState.currentCategory) {
      document.getElementById('active-category').textContent = optimizationState.currentCategory;
      document.getElementById('aoi-hud-overlay').classList.remove('hidden');
      window.executeParametricSearch();
    } else {
      appendSystemLog("THÔNG BÁO: Không thể định dạng phân hệ ngành hàng cấu trúc. Vui lòng chọn trực tiếp [Máy lạnh / Tủ lạnh / Laptop].");
    }
    latencyBox.textContent = `${Math.round(performance.now() - t0)}ms`;
  }, 400);
}

window.executeParametricSearch = function() {
  const cat = optimizationState.currentCategory;
  if (!cat) return;

  const products = CONFIG_CATALOG[cat];
  let cardsHtml = `<div class="text-xs font-mono mb-2 text-slate-400 uppercase tracking-wider">KẾT QUẢ ĐỐI CHIẾU DANH MỤC THỜI GIAN THỰC:</div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">`;

  products.forEach(p => {
    cardsHtml += `
      <div class="bg-brand-panel border border-brand-border p-3 flex flex-col justify-between font-mono text-xs space-y-2">
        <div>
          <div class="text-[10px] text-brand-electric font-bold">MÃ THIẾT BỊ: ${p.id.toUpperCase()}</div>
          <h4 class="text-white font-bold text-xs mt-1 line-clamp-2">${p.name}</h4>
          <div class="text-brand-gold font-bold mt-1">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
          <div class="mt-2 pt-2 border-t border-brand-border/60 text-[10px] text-slate-400 space-y-0.5">
            <div>Chỉ số tương thích: <strong>${p.specMatch}%</strong></div>
            <div>Hiệu năng tiêu thụ năng lượng: <strong>${p.energyRating}%</strong></div>
          </div>
        </div>
        <button onclick="window.selectAndEvaluateProduct('${cat}', '${p.id}')" class="w-full bg-brand-dark hover:bg-brand-cobalt border border-brand-border text-white text-[11px] font-bold py-1.5 transition-all">
          [PHÂN TÍCH CẤU HÌNH]
        </button>
      </div>`;
  });

  cardsHtml += `</div>`;
  appendSystemLog(cardsHtml);
};

window.selectAndEvaluateProduct = function(cat, id) {
  const product = CONFIG_CATALOG[cat].find(p => p.id === id);
  if (!product) return;

  optimizationState.selectedProduct = product;
  recomputeAoiIndex();

  // TOÀN THỂ HOÀN TẤT THỬ THÁCH: BÁO CÁO TỐI ƯU HÓA KIẾN TRÚC THAY THẾ TIN NHẮN CUỐI CHAT
  const metrics = optimizationState.calculatedMetrics;
  let reportHtml = `
    <div class="bg-brand-dark border-2 border-brand-electric p-4 font-mono text-xs w-full space-y-3 message-fade-in">
      <div class="text-center font-bold text-sm text-white border-b border-brand-border pb-2 tracking-widest">
        BÁO CÁO KẾT QUẢ TỐI ƯU HÓA CẤU HÌNH HỆ THỐNG
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] border-b border-brand-border pb-2">
        <div><span class="text-slate-400">Thiết bị cấu hình:</span> <br><strong class="text-white">${product.name}</strong></div>
        <div><span class="text-slate-400">Tổng chi phí thực tế:</span> <br><strong class="text-brand-gold">${new Intl.NumberFormat('vi-VN').format(product.price)} VND</strong></div>
      </div>

      <div class="space-y-1">
        <div class="text-[10px] font-bold text-slate-300">PHÂN TÍCH ĐÁNH GIÁ CHỈ SỐ AOI TRỌNG SỐ:</div>
        <div class="flex justify-between"><span>Hiệu quả sử dụng ngân sách:</span> <strong class="text-white">${metrics.budgetEfficiency}/100</strong></div>
        <div class="flex justify-between"><span>Độ thích ứng vật lý thực tế:</span> <strong class="text-white">${metrics.utilityMatch}/100</strong></div>
        <div class="flex justify-between"><span>Hệ số vận hành bền vững:</span> <strong class="text-white">${metrics.sustainabilityScore}/100</strong></div>
        <div class="flex justify-between border-t border-brand-border pt-1 font-bold text-brand-electric">
          <span>ĐIỂM HIỆU NĂNG KIẾN TRÚC (TOTAL AOI):</span>
          <span>${metrics.totalAoi}/100</span>
        </div>
      </div>

      <div class="p-2 bg-brand-panel text-slate-300 text-[11px] leading-relaxed border border-brand-border">
        <strong>Phân tích Đánh Đổi (Trade-off Matrix):</strong>
        ${metrics.totalAoi >= 85
          ? "Cấu hình đạt mức tương thích lý tưởng. Tỷ lệ suy hao tài chính tối thiểu, công suất đáp ứng dư tải, hệ số tiết kiệm năng lượng đạt chuẩn vận hành công nghiệp."
          : "Cấu hình ở trạng thái cân bằng giới hạn. Ngân sách ban đầu được tối ưu hóa tuy nhiên chỉ số dự phòng công suất tương lai bị thu hẹp đáng kể."}
      </div>

      <div class="text-[10px] text-brand-success font-bold text-center pt-1">
        <i class="fa-solid fa-square-check"></i> CẤU HÌNH ĐÃ ĐƯỢC CHUYỂN VÀO HỆ THỐNG KHO PHÂN PHỐI ĐIỆN MÁY XANH
      </div>
    </div>
  `;

  appendSystemLog(reportHtml);

  // Cộng kinh nghiệm tích lũy nâng cấp Tier tài khoản người dùng
  userExpertiseProfile.totalOptimized += 1;
  userExpertiseProfile.xp += 150;
  if (userExpertiseProfile.xp >= 4000) {
    userExpertiseProfile.tier = "Technology Architect";
  }
  syncExpertiseWidgetUI();
};

function appendUserSimulationLog(text) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;
  const html = `
    <div class="flex items-start justify-end space-x-2 message-fade-in">
      <div class="bg-brand-border text-white border border-slate-700 font-mono text-xs p-3 max-w-[80%]">
        <span class="text-brand-electric font-bold">[USR_EXEC]:</span> ${text}
      </div>
    </div>`;
  chatBox.insertAdjacentHTML('beforeend', html);
  scrollChatToBottom();
}

function appendSystemLog(htmlContent) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;
  const html = `
    <div class="flex items-start space-x-3 message-fade-in">
      <div class="w-8 h-8 border border-brand-electric bg-brand-panel flex items-center justify-center text-brand-electric text-xs font-mono font-bold shrink-0">
        SYS
      </div>
      <div class="max-w-[85%] w-full">
        <div class="bg-brand-panel text-slate-300 p-4 border border-brand-border font-mono text-xs leading-relaxed">
          ${htmlContent}
        </div>
      </div>
    </div>`;
  chatBox.insertAdjacentHTML('beforeend', html);
  scrollChatToBottom();
}

window.resetConversation = function() {
  optimizationState = {
    currentCategory: null,
    constraints: { maxBudget: 30000000, roomCapacity: 15, userCount: 2, performanceRequirement: 'medium' },
    selectedProduct: null,
    calculatedMetrics: { budgetEfficiency: 0, utilityMatch: 0, sustainabilityScore: 0, totalAoi: 0 }
  };
  document.getElementById('aoi-hud-overlay').classList.add('hidden');
  document.getElementById('chat-box').innerHTML = `
    <div class="flex items-start space-x-3 message-fade-in">
      <div class="w-8 h-8 border border-brand-electric bg-brand-panel flex items-center justify-center text-brand-electric text-xs font-mono font-bold shrink-0">
        SYS
      </div>
      <div class="max-w-[85%] w-full">
        <div class="bg-brand-panel text-slate-200 p-4 border border-brand-border font-mono text-xs leading-relaxed">
          <p class="font-bold text-sm text-white border-b border-brand-border pb-1.5 mb-2">HỆ THỐNG ĐÃ KHỞI ĐỘNG LẠI</p>
          <p>Vui lòng chọn phân hệ thiết bị đích để cấu hình lại các thông số ràng buộc kỹ thuật tối ưu hóa:</p>
          <div class="mt-3 flex gap-2">
            <button onclick="window.triggerCategorySelection('air_conditioner')" class="px-3 py-1.5 bg-brand-dark hover:bg-slate-800 border border-brand-border text-brand-electric font-bold transition-all">[01] MÁY LẠNH</button>
            <button onclick="window.triggerCategorySelection('refrigerator')" class="px-3 py-1.5 bg-brand-dark hover:bg-slate-800 border border-brand-border text-brand-electric font-bold transition-all">[02] TỦ LẠNH</button>
            <button onclick="window.triggerCategorySelection('laptop')" class="px-3 py-1.5 bg-brand-dark hover:bg-slate-800 border border-brand-border text-brand-electric font-bold transition-all">[03] LAPTOP</button>
          </div>
        </div>
      </div>
    </div>`;
  scrollChatToBottom();
};

function scrollChatToBottom() {
  const box = document.getElementById('chat-box');
  if (box) box.scrollTop = box.scrollHeight;
}
