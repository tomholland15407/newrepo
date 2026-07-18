/* eslint-disable */
/**
 * Smart Assistant - Trợ Lý Mua Sắm Thông Thái (JS Engine Nâng Cấp Toàn Diện)
 * Bộ điều phối hội thoại thông minh tích hợp bộ trích xuất thực thể (Slot-Filling)
 * Hoàn toàn không cắt xén logic - Sẵn sàng chạy Production Mockup
 */

const MOCK_CATALOG = {
  ac: [
    {
      id: 'ac-pana-01',
      name: 'Panasonic Inverter 1 HP CU/CS-XPU9XKH-8',
      price: 11490000,
      brand: 'Panasonic',
      room_size: 'Dưới 15m²',
      noise: '19dB - siêu êm',
      inverter: true,
      stock: 12,
    },
    {
      id: 'ac-daikin-02',
      name: 'Daikin Inverter 1.5 HP FTKB35WAVMV',
      price: 13990000,
      brand: 'Daikin',
      room_size: 'Từ 15 đến 20m²',
      noise: '22dB - rất yên tĩnh',
      inverter: true,
      stock: 8,
    },
    {
      id: 'ac-casper-03',
      name: 'Casper Inverter 1 HP TC-09IS35',
      price: 5890000,
      brand: 'Casper',
      room_size: 'Dưới 15m²',
      noise: '28dB - trung bình',
      inverter: true,
      stock: 25,
    }
  ],
  fridge: [
    {
      id: 'fridge-samsung-01',
      name: 'Tủ lạnh Samsung Inverter 236 lít RT22M4032BY/SV',
      price: 6490000,
      brand: 'Samsung',
      liters: 236,
      family_size: '2 - 4 người',
      cooling: 'Chế độ đông mềm Optimal Fresh Zone tiện lợi',
      stock: 5,
    },
    {
      id: 'fridge-lg-02',
      name: 'Tủ lạnh LG Inverter 315 lít GN-D312PS',
      price: 8890000,
      brand: 'LG',
      liters: 315,
      family_size: '3 - 5 người',
      cooling: 'Hệ thống làm lạnh đa chiều Door Cooling tỏa đều',
      stock: 15,
    },
    {
      id: 'fridge-aqua-03',
      name: 'Tủ lạnh Aqua 90 lít AQR-D99FA',
      price: 2790000,
      brand: 'Aqua',
      liters: 90,
      family_size: '1 - 2 người (Sinh viên)',
      cooling: 'Làm lạnh trực tiếp bằng mạch khí cơ bản',
      stock: 4,
    }
  ],
  laptop: [
    {
      id: 'laptop-hp-01',
      name: 'HP Pavilion 14-dv2073TU (Core i5 / 8GB RAM / 512GB SSD)',
      price: 14500000,
      brand: 'HP',
      weight: '1.4kg',
      screen: '14 inch Full HD',
      stock: 9,
    },
    {
      id: 'laptop-asus-02',
      name: 'Asus Vivobook 14 OLED (Core i5 / 8GB RAM / 512GB SSD)',
      price: 15200000,
      brand: 'Asus',
      weight: '1.6kg',
      screen: '14 inch OLED siêu sắc nét',
      stock: 14,
    },
    {
      id: 'laptop-lenovo-03',
      name: 'Lenovo IdeaPad Slim 3 (Core i5 / 16GB RAM / 512GB SSD)',
      price: 12900000,
      brand: 'Lenovo',
      weight: '1.43kg',
      screen: '14 inch viền mỏng',
      stock: 22,
    }
  ]
};

const MOCK_PROMOTIONS = {
  installment_0: ['ac-pana-01', 'ac-daikin-02', 'fridge-lg-02'],
  discounts: {
    'ac-pana-01': 'Tặng combo ống đồng vật tư 800.000đ',
    'laptop-asus-02': 'Tặng chuột không dây Bluetooth chính hãng',
    'fridge-lg-02': 'Phiếu mua hàng gia dụng trị giá 300.000đ',
  }
};

const MOCK_FAQ = {
  'bảo hành': 'Dạ, sản phẩm tại Điện Máy Xanh được bảo hành chính hãng 1 đổi 1 trong vòng 30 ngày đầu nếu có lỗi phần cứng từ nhà sản xuất ạ!',
  'giao hàng': 'Dạ, hệ thống miễn phí vận chuyển lắp đặt trong bán kính 10km quanh siêu thị gần nhất ngay trong ngày ạ.',
  'trả góp': 'Dạ, hiện tại có chương trình hỗ trợ trả góp 0% lãi suất qua căn cước công dân gắn chip cực nhanh chóng, xét duyệt chỉ 5 phút ạ.'
};

const MASCOT_IMAGES = ['mascot.png'];

let sessionState = {
  stage: 'INIT',
  category: null,
  collectedData: { brand: null, budget: null, roomSize: null, familySize: null, purpose: null }
};

let consumerChatSessions = [];
let activeSessionId = null;

// ==========================================
// TACTICAL GAME VARIABLE LEDGER
// ==========================================
let playerGameState = {
  level: 1,
  xpCurrent: 0,
  xpTarget: 100,
  goldScore: 0,
  spellStreak: 0,
  hpGauge: 100,
  mpGauge: 100,
  campaignQuests: {
    firstContact: { code: 'firstContact', label: 'Bat dau chien dich', done: false, prize: 35 },
    deepScan: { code: 'deepScan', label: 'Khai pha chi tiet', done: false, prize: 60 },
    supportNode: { code: 'supportNode', label: 'Khai thac mat thu', done: false, prize: 45 },
    instantBuy: { code: 'instantBuy', label: 'Chinh phuc bao vat', done: false, prize: 120 }
  }
};

// ==========================================
// INTERFACE COLLAPSIBLE PANEL CONTROLLERS
// ==========================================
function initCollapsibleSidebarLogic() {
  const sidebarPanel = document.getElementById('sidebar-panel');
  const btnClose = document.getElementById('btn-close-sidebar');
  const btnOpen = document.getElementById('btn-open-sidebar');

  if (!sidebarPanel || !btnClose || !btnOpen) return;

  btnClose.addEventListener('click', () => {
    sidebarPanel.classList.remove('w-80', 'p-5', 'border-r');
    sidebarPanel.classList.add('w-0', 'p-0', 'border-r-0', 'opacity-0', 'pointer-events-none');
    btnOpen.classList.remove('hidden');
  });

  btnOpen.addEventListener('click', () => {
    sidebarPanel.classList.remove('w-0', 'p-0', 'border-r-0', 'opacity-0', 'pointer-events-none');
    sidebarPanel.classList.add('w-80', 'p-5', 'border-r');
    btnOpen.classList.add('hidden');
  });
}

function triggerMascotSpriteImpactAnimation() {
  const spriteElements = document.querySelectorAll('.mascot-sprite-node');
  spriteElements.forEach(node => {
    node.classList.add('mascot-combat-strike');
    setTimeout(() => {
      node.classList.remove('mascot-combat-strike');
    }, 450);
  });
}

window.handleBuyProduct = function() {
  window.appendAssistantMessage('<p class="text-sm font-bold text-emerald-400"><i class="fa-solid fa-shield-halved mr-1.5"></i>Lenh truyen duoc gui. Giao dich thanh cong. Bao vat da khoa vao tai khoan hanh trang cua cu dan!</p>');
  triggerMascotSpriteImpactAnimation();

  modifyPlayerGameStats(playerGameState.campaignQuests.instantBuy.prize, 'Chinh Phuc Bao Vat');
  markCampaignQuestResolved('instantBuy');

  const mainStageMascot = document.getElementById('header-mascot');
  if (mainStageMascot) {
    mainStageMascot.classList.remove('animate-glowing-orb');
    mainStageMascot.classList.add('animate-violent-bounce');
    setTimeout(() => {
      mainStageMascot.classList.remove('animate-violent-bounce');
      mainStageMascot.classList.add('animate-glowing-orb');
    }, 1000);
  }
};

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
}

document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('custom-btn-select')) {
    window.handleBuyProduct();
  }
});

function scrollChatToBottom() {
  const chatBox = document.getElementById('chat-box');
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;
  const html = `
    <div id="typing-indicator" class="flex items-start space-x-3.5 message-fade-in">
      <div class="w-10 h-10 border-2 border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-[inset_0_0_6px_rgba(0,149,218,0.5)]">
        <img src="img/mascot.png" class="w-full h-full object-contain p-0.5 animate-mascot-idle mascot-sprite-node">
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 shadow-md">
        <div class="flex items-center space-x-1.5 py-1">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    </div>`;
  chatBox.insertAdjacentHTML('beforeend', html);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;
  const html = `
    <div class="flex items-start space-x-3 justify-end message-fade-in">
      <div class="space-y-1 max-w-[80%]">
        <div class="bg-slate-900 border-2 border-brand-electric text-slate-100 rounded-lg px-4 py-2.5 shadow-md">
          <p class="text-xs font-mono tracking-wide"><span class="text-brand-electric font-bold"> PLAYER></span> ${text}</p>
        </div>
      </div>
    </div>`;
  chatBox.insertAdjacentHTML('beforeend', html);
  scrollChatToBottom();

  if (activeSessionId) {
    const s = consumerChatSessions.find(item => item.id === activeSessionId);
    if (s) s.messages.push({ role: 'user', content: text });
  }
}

function appendAssistantMessage(htmlContent) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;
  const html = `
    <div class="flex items-start space-x-3.5 message-fade-in">
      <div class="w-10 h-10 border-2 border-slate-700 bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden shadow-[inset_0_0_6px_rgba(0,149,218,0.5)]">
        <img src="img/mascot.png" class="w-[90%] h-[90%] object-contain animate-mascot-idle mascot-sprite-node" id="live-dynamic-avatar-node">
      </div>
      <div class="space-y-1 max-w-[85%] w-full">
        <div class="bg-slate-950/90 text-slate-300 rounded-lg px-5 py-3.5 border-2 border-slate-800 shadow-xl relative overflow-hidden">
          <div class="absolute top-0 left-0 w-2 h-2 bg-brand-electric"></div>
          <div class="absolute top-0 right-0 w-2 h-2 bg-brand-electric"></div>
          <div class="absolute bottom-0 left-0 w-2 h-2 bg-brand-electric"></div>
          <div class="absolute bottom-0 right-0 w-2 h-2 bg-brand-electric"></div>
          <div class="text-xs leading-relaxed font-mono">${htmlContent}</div>
        </div>
      </div>
    </div>`;
  chatBox.insertAdjacentHTML('beforeend', html);
  scrollChatToBottom();

  applyCurrentDynamicMascotAura();

  if (activeSessionId) {
    const s = consumerChatSessions.find(item => item.id === activeSessionId);
    if (s) s.messages.push({ role: 'assistant', content: htmlContent });
  }
}
window.appendAssistantMessage = appendAssistantMessage;

// ==========================================
// QUẢN LÝ LỊCH SỬ PHIÊN TRÒ CHUYỆN (SESSIONS)
// ==========================================
function createNewChatSession(initialTitle = "Cuộc trò chuyện mới") {
  const newId = 'session_' + Date.now();
  const newSession = {
    id: newId,
    title: initialTitle,
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    messages: [],
    category: null,
    mascot: 'mascot.png'
  };
  consumerChatSessions.unshift(newSession);
  activeSessionId = newId;
  renderChatHistoryUI();
  return newSession;
}

function updateActiveSessionTitle(newTitle, categoryCode) {
  if (!activeSessionId) return;
  const s = consumerChatSessions.find(item => item.id === activeSessionId);
  if (s) {
    s.title = newTitle;
    if (categoryCode) s.category = categoryCode;
    renderChatHistoryUI();
  }
}

function renderChatHistoryUI() {
  const container = document.getElementById('chat-history-list');
  if (!container) return;

  if (consumerChatSessions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6 px-4 border border-dashed border-slate-800 rounded-lg bg-slate-950/50">
        <p class="text-[10px] text-slate-600 font-mono">Hanh trang rong.</p>
      </div>`;
    return;
  }

  container.innerHTML = '';
  consumerChatSessions.forEach(session => {
    const isActive = session.id === activeSessionId;
    const pill = document.createElement('div');

    pill.className = `group flex items-center justify-between p-2.5 rounded-lg border font-mono text-[11px] transition-all duration-150 cursor-pointer ${
      isActive
      ? 'border-brand-electric bg-brand-electric/10 text-brand-electric shadow-[0_0_8px_rgba(0,149,218,0.2)]'
      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
    }`;

    pill.innerHTML = `
      <div class="flex items-center space-x-2 truncate w-full">
        <i class="fa-solid fa-box-open text-xs shrink-0 ${isActive ? 'text-brand-electric' : 'text-slate-600'}"></i>
        <div class="truncate flex flex-col text-left">
          <span class="truncate font-bold">${session.title}</span>
          <span class="text-[9px] text-slate-600 mt-0.5">${session.timestamp}</span>
        </div>
      </div>`;

    pill.addEventListener('click', () => {
      activeSessionId = session.id;
      renderChatHistoryUI();
      restoreSessionMessages(session);
    });
    container.appendChild(pill);
  });
}

function restoreSessionMessages(session) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  if (!session.messages || session.messages.length === 0) {
    chatBox.innerHTML = `
      <div class="flex items-start space-x-3.5 message-fade-in">
        <div class="w-10 h-10 border-2 border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-[inset_0_0_6px_rgba(0,149,218,0.5)]">
          <img src="img/mascot.png" class="w-[90%] h-[90%] object-contain animate-mascot-idle mascot-sprite-node">
        </div>
        <div class="space-y-1 max-w-[85%] w-full">
          <div class="bg-slate-950/90 text-slate-300 rounded-lg px-5 py-3.5 border-2 border-slate-800 text-xs font-mono">
            Dạ, phiên hội thoại tư vấn mua sắm mới đã sẵn sàng phục vụ rồi ạ! Anh/chị cần em hỗ trợ tìm kiếm dòng thiết bị công nghệ điện máy nào thế ạ?
          </div>
        </div>
      </div>`;
    sessionState.stage = 'INIT';
    sessionState.category = null;
    sessionState.collectedData = { brand: null, budget: null, roomSize: null, familySize: null, purpose: null };

    document.getElementById('active-category').textContent = 'Chưa xác định';
    document.getElementById('chat-stage').textContent = 'INIT';
    scrollChatToBottom();
    return;
  }

  chatBox.innerHTML = '';
  session.messages.forEach(msg => {
    if (msg.role === 'user') {
      const html = `<div class="flex items-start space-x-3 justify-end message-fade-in"><div class="max-w-[80%] bg-slate-900 border-2 border-brand-electric text-slate-100 rounded-lg px-4 py-2.5 text-xs font-mono">PLAYER> ${msg.content}</div></div>`;
      chatBox.insertAdjacentHTML('beforeend', html);
    } else {
      const html = `<div class="flex items-start space-x-3.5 message-fade-in"><div class="w-10 h-10 border-2 border-slate-700 bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden"><img src="img/mascot.png" class="w-[90%] h-[90%] object-contain animate-mascot-idle mascot-sprite-node"></div><div class="max-w-[85%] w-full bg-slate-950/90 text-slate-300 rounded-lg px-5 py-3.5 border-2 border-slate-800 text-xs font-mono">${msg.content}</div></div>`;
      chatBox.insertAdjacentHTML('beforeend', html);
    }
  });

  sessionState.category = session.category;
  sessionState.stage = session.messages.length > 0 ? 'RECOMMENDATION' : 'INIT';
  document.getElementById('active-category').textContent = session.category || 'Chưa xác định';
  document.getElementById('chat-stage').textContent = sessionState.stage;
  scrollChatToBottom();
}

// ========================================================
// HEURISTIC NLP PARSER - TRÍCH XUẤT THÔNG TIN TỰ NHIÊN TIẾNG VIỆT
// ========================================================
function extractEntitiesFromText(text) {
  const lower = text.toLowerCase();
  let result = {};

  if (lower.includes('máy lạnh') || lower.includes('điều hòa') || lower.includes('đh')) {
    result.category = 'ac';
  } else if (lower.includes('tủ lạnh') || lower.includes('tl')) {
    result.category = 'fridge';
  } else if (lower.includes('laptop') || lower.includes('máy tính')) {
    result.category = 'laptop';
  }

  const brandsList = ['panasonic', 'daikin', 'casper', 'samsung', 'lg', 'aqua', 'hp', 'asus', 'lenovo'];
  for (const b of brandsList) {
    if (lower.includes(b)) {
      result.brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }
  if (!result.brand && lower.includes('pana')) result.brand = 'Panasonic';

  const priceRegex = /(dưới|trên|tầm|khoảng|~)?\s*(\d+)\s*(triệu|tr|củ)/i;
  const matchPrice = lower.match(priceRegex);
  if (matchPrice) {
    const modifier = matchPrice[1] || 'tầm';
    const numericValue = parseInt(matchPrice[2], 10) * 1000000;
    result.budget = { modifier, value: numericValue };
  }

  const roomRegex = /(\d+)\s*(m2|m²)/i;
  const matchRoom = lower.match(roomRegex);
  if (matchRoom) {
    result.roomSize = parseInt(matchRoom[1], 10);
  } else if (lower.includes('phòng ngủ')) {
    result.roomSize = 12;
  } else if (lower.includes('phòng khách')) {
    result.roomSize = 22;
  }

  const familyRegex = /(\d+)\s*(người|thành viên|nhân khẩu)/i;
  const matchFamily = lower.match(familyRegex);
  if (matchFamily) {
    result.familySize = parseInt(matchFamily[1], 10);
  } else if (lower.includes('sinh viên') || lower.includes('ở một mình') || lower.includes('trọ')) {
    result.familySize = 1;
  }

  if (lower.includes('sinh viên') || lower.includes('học tập') || lower.includes('văn phòng') || lower.includes('mỏng nhẹ')) {
    result.purpose = 'office';
  } else if (lower.includes('gaming') || lower.includes('đồ họa') || lower.includes('chơi game')) {
    result.purpose = 'heavy';
  }

  return result;
}

// ========================================================
// CORE LOGIC ENGINE - ĐIỀU PHỐI HỘI THOẠI & DỮ LIỆU RAG
// ========================================================
function handleFormSubmit(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const input = document.getElementById('user-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  if (!activeSessionId) createNewChatSession();

  appendUserMessage(val);
  input.value = '';
  showTypingIndicator();

  // Kich hoat mach do tim to hop toan ma chiêu thong tin
  analyzeStrategicSpellCombos(val);

  setTimeout(() => {
    removeTypingIndicator();
    dispatchLogicEngine(val);
  }, 1300);
}

function dispatchLogicEngine(text) {
  const startTime = performance.now();
  const lower = text.toLowerCase();

  // Khoi dong chien dich ngay khi buoc vao tran combat dau tien
  if (!playerGameState.campaignQuests.firstContact.done) {
    modifyPlayerGameStats(playerGameState.campaignQuests.firstContact.prize, 'Lien Ket Linh Hon Mascot');
    markCampaignQuestResolved('firstContact');
  }

  for (const [key, answer] of Object.entries(MOCK_FAQ)) {
    if (lower.includes(key)) {
      document.getElementById('rag-faq-status').textContent = `Khớp FAQ: [${key}]`;
      document.getElementById('latency-val').textContent = Math.round(performance.now() - startTime) + 'ms';
      appendAssistantMessage(`<p class="text-xs font-mono"><i class="fa-solid fa-scroll text-amber-500 mr-1.5"></i>[THONG TIN QUAN TRONG] ${answer}</p>`);

      modifyPlayerGameStats(25, 'Khai Pha Mat Thu FAQ');
      markCampaignQuestResolved('supportNode');
      return;
    }
  }
  document.getElementById('rag-faq-status').textContent = 'Không khớp FAQ';

  const extracted = extractEntitiesFromText(text);

  if (extracted.category) sessionState.category = extracted.category;
  if (extracted.brand) sessionState.collectedData.brand = extracted.brand;
  if (extracted.budget) sessionState.collectedData.budget = extracted.budget;
  if (extracted.roomSize) sessionState.collectedData.roomSize = extracted.roomSize;
  if (extracted.familySize) sessionState.collectedData.familySize = extracted.familySize;
  if (extracted.purpose) sessionState.collectedData.purpose = extracted.purpose;

  document.getElementById('active-category').textContent = sessionState.category || 'Chưa xác định';
  document.getElementById('slang-inspector').textContent = JSON.stringify(sessionState.collectedData);

  // Ghi nhan nhiem vu phuc tap phan tich tim kiem chuyen sau
  let totalDetections = 0;
  if (extracted.brand) totalDetections++;
  if (extracted.budget) totalDetections++;
  if (extracted.roomSize || extracted.familySize) totalDetections++;
  if (totalDetections >= 2) {
    modifyPlayerGameStats(playerGameState.campaignQuests.deepScan.prize, 'Phan Tich Tran Phap Chuyen Sau');
    markCampaignQuestResolved('deepScan');
  }

  if (!sessionState.category) {
    sessionState.stage = 'INIT';
    document.getElementById('chat-stage').textContent = sessionState.stage;
    document.getElementById('latency-val').textContent = Math.round(performance.now() - startTime) + 'ms';
    appendAssistantMessage('Dạ, em có thể hỗ trợ tư vấn chuyên sâu và so sánh thông thái về 3 nhóm sản phẩm: <strong>Máy lạnh, Tủ lạnh, hoặc Laptop</strong>. Anh/chị đang có nhu cầu tìm mua sản phẩm nào ạ?');
    return;
  }

  let categoryLabel = "Trò chuyện";
  if (sessionState.category === 'ac') categoryLabel = "Tư vấn Máy Lạnh";
  if (sessionState.category === 'fridge') categoryLabel = "Tư vấn Tủ Lạnh";
  if (sessionState.category === 'laptop') categoryLabel = "Tư vấn Laptop";
  updateActiveSessionTitle(categoryLabel, sessionState.category);

  if (sessionState.category === 'ac' && !sessionState.collectedData.roomSize) {
    if (sessionState.stage === 'PROBING') {
      sessionState.collectedData.roomSize = 12;
      appendAssistantMessage('<p class="text-[11px] font-mono text-slate-500 mb-2"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i> [MA LUCH BO TRO] Lay mac dinh khong gian phong ngu standard (duoi 15m2) de quet bau vat phu hop.</p>');
    } else {
      sessionState.stage = 'PROBING';
      document.getElementById('chat-stage').textContent = sessionState.stage;
      document.getElementById('latency-val').textContent = Math.round(performance.now() - startTime) + 'ms';
      appendAssistantMessage('Dạ, để em tính toán công suất số Ngựa (HP) tối ưu nhất, anh/chị cho em hỏi <strong>diện tích phòng lắp đặt khoảng bao nhiêu m²</strong> (hoặc lắp cho không gian nào như phòng ngủ, phòng khách) ạ?');
      return;
    }
  }

  if (sessionState.category === 'fridge' && !sessionState.collectedData.familySize) {
    if (sessionState.stage === 'PROBING') {
      sessionState.collectedData.familySize = 3;
      appendAssistantMessage('<p class="text-[11px] font-mono text-slate-500 mb-2"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i> [MA LUCH BO TRO] Tu dong thiet lap cau hinh tieu chuan ho gia dinh 3 thanh vien nhan khau.</p>');
    } else {
      sessionState.stage = 'PROBING';
      document.getElementById('chat-stage').textContent = sessionState.stage;
      document.getElementById('latency-val').textContent = Math.round(performance.now() - startTime) + 'ms';
      appendAssistantMessage('Dạ, nhà mình dự kiến **có khoảng bao nhiêu thành viên** sẽ dùng chung tủ lạnh ạ, để em lọc mức dung tích (lít) chứa thực phẩm vừa vặn nhất cho gia đình mình?');
      return;
    }
  }

  if (sessionState.category === 'laptop' && !sessionState.collectedData.brand && !sessionState.collectedData.budget) {
    if (sessionState.stage !== 'PROBING') {
      sessionState.stage = 'PROBING';
      document.getElementById('chat-stage').textContent = sessionState.stage;
      document.getElementById('latency-val').textContent = Math.round(performance.now() - startTime) + 'ms';
      appendAssistantMessage('Dạ, anh/chị tìm mua laptop phục vụ chính cho **nhu cầu học tập văn phòng mỏng nhẹ** hay **đồ họa chơi game nặng** ạ? Nếu mình có khoảng ngân sách dự kiến, hãy chia sẻ để em định hình máy chuẩn nhất nha!');
      return;
    }
  }

  sessionState.stage = 'RECOMMENDATION';
  document.getElementById('chat-stage').textContent = sessionState.stage;

  const catalog = MOCK_CATALOG[sessionState.category];
  let filteredProducts = [...catalog];

  if (sessionState.collectedData.brand) {
    const targetBrand = sessionState.collectedData.brand.toLowerCase();
    filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase().includes(targetBrand));
  }

  if (sessionState.collectedData.budget) {
    const { modifier, value } = sessionState.collectedData.budget;
    if (modifier === 'dưới') {
      filteredProducts = filteredProducts.filter(p => p.price <= value);
    } else if (modifier === 'trên') {
      filteredProducts = filteredProducts.filter(p => p.price >= value);
    } else {
      filteredProducts = filteredProducts.filter(p => p.price <= value * 1.15);
    }
  }

  if (sessionState.category === 'ac' && sessionState.collectedData.roomSize) {
    const size = sessionState.collectedData.roomSize;
    if (size <= 15) {
      filteredProducts = filteredProducts.filter(p => p.room_size.includes('Dưới 15m²'));
    } else {
      filteredProducts = filteredProducts.filter(p => p.room_size.includes('15 đến 20m²'));
    }
  }

  if (sessionState.category === 'fridge' && sessionState.collectedData.familySize) {
    const size = sessionState.collectedData.familySize;
    if (size <= 2) {
      filteredProducts = filteredProducts.filter(p => p.family_size.includes('1 - 2') || p.family_size.includes('2 - 4'));
    } else if (size >= 3 && size <= 4) {
      filteredProducts = filteredProducts.filter(p => p.family_size.includes('2 - 4') || p.family_size.includes('3 - 5'));
    } else {
      filteredProducts = filteredProducts.filter(p => p.family_size.includes('3 - 5'));
    }
  }

  let isFallbackTriggered = false;
  if (filteredProducts.length === 0) {
    filteredProducts = [...catalog];
    isFallbackTriggered = true;
  }

  document.getElementById('rag-catalog-status').textContent = `Tìm thấy ${filteredProducts.length} mẫu`;
  document.getElementById('rag-promo-status').textContent = 'Đã áp mã khuyến mãi dynamic';

  let introductionPrompt = "";
  if (isFallbackTriggered) {
    introductionPrompt = `Khai thac kho hang: Khong tim thay bao vat hop 100% thuoc tinh. Da cu phat **Top ${filteredProducts.length} thiet bi co ti le drop cao nhat** tai ma ban do de anh/chi lua chon:`;
  } else {
    introductionPrompt = `Ket qua quet tran dia thoi gian thuc: Tim thay **${filteredProducts.length} thiet bi dat chuan chi so**. Duoi day la thong so va danh gia nhuoc diem chi tiet:`;
  }

  let cardsHtml = `<p class="mb-4 font-mono text-xs">${introductionPrompt}</p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;

  filteredProducts.forEach((product, idx) => {
    const hasZeroInstallment = MOCK_PROMOTIONS.installment_0.includes(product.id);
    const promotionGift = MOCK_PROMOTIONS.discounts[product.id] || 'Tặng phiếu mua hàng trị giá 200.000đ (Áp dụng mua đồ gia dụng)';

    // Algorithmic rarity index binding
    let rarityClass = "loot-card-common";
    let rarityLabel = "Vat Pham Thong Thuong";
    if (product.price >= 6000000 && product.price <= 13000000) {
      rarityClass = "loot-card-rare";
      rarityLabel = "Bao Vat Hieng Co";
    } else if (product.price > 13000000) {
      rarityClass = "loot-card-legendary";
      rarityLabel = "Vat Pham Truyen THUYET";
    }

    let tradeOffAnalysis = "Dòng sản phẩm quốc dân, lượng đặt mua rất cao dễ gặp tình trạng thiếu hàng cục bộ tại một số quận huyện.";
    if (product.price < 6000000) {
      tradeOffAnalysis = "Giá thành siêu rẻ tiết kiệm chi phí, tuy nhiên tính năng chỉ dừng ở mức cơ bản, không tích hợp nhiều công nghệ cảm biến cao cấp.";
    } else if (product.price > 13000000) {
      tradeOffAnalysis = "Công nghệ và độ bền xuất sắc hàng đầu, tuy nhiên tổng chi phí đầu tư ban đầu sẽ cao hơn các thương hiệu phổ thông.";
    }

    let specsHtml = "";
    if (sessionState.category === 'ac') {
      specsHtml = `<li><i class="fa-solid fa-expand text-slate-500 mr-1.5"></i>Khong gian: <strong>${product.room_size}</strong></li>
                   <li><i class="fa-solid fa-volume-low text-slate-500 mr-1.5"></i>Am thanh: <strong>${product.noise}</strong></li>`;
    } else if (sessionState.category === 'fridge') {
      specsHtml = `<li><i class="fa-solid fa-box-open text-slate-500 mr-1.5"></i>Suc chua: <strong>${product.liters} Lit</strong></li>
                   <li><i class="fa-solid fa-snowflake text-slate-500 mr-1.5"></i>Cong nghe: <strong>${product.family_size}</strong></li>`;
    } else if (sessionState.category === 'laptop') {
      specsHtml = `<li><i class="fa-solid fa-weight-hanging text-slate-500 mr-1.5"></i>Khoi luong: <strong>${product.weight}</strong></li>
                   <li><i class="fa-solid fa-laptop text-slate-500 mr-1.5"></i>Hien thi: <strong>${product.screen}</strong></li>`;
    }

    cardsHtml += `
      <div class="${rarityClass} rounded-lg p-4 flex flex-col justify-between space-y-3.5 shadow-lg transition-transform hover:scale-[1.02] border font-mono">
        <div>
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 text-[9px] font-bold bg-slate-900 text-slate-400 border border-slate-800 rounded uppercase">${rarityLabel}</span>
            ${hasZeroInstallment ? `<span class="px-2 py-0.5 text-[9px] font-black bg-emerald-950 border border-emerald-500 text-emerald-400 rounded flex items-center gap-0.5"><i class="fa-solid fa-bolt text-[8px]"></i> GIAM TAI TOI DA</span>` : ''}
          </div>
          <h3 class="font-extrabold text-xs text-slate-100 mt-2 line-clamp-2 h-9 leading-snug">${product.name}</h3>
          <div class="text-[14px] font-black text-brand-electric tracking-wider mt-1.5">${formatVND(product.price)}</div>

          <ul class="text-[10px] text-slate-400 mt-2.5 space-y-1.5 bg-slate-950 p-2.5 rounded border border-slate-900">
            ${specsHtml}
          </ul>

          <p class="text-[10px] text-amber-500 font-bold mt-2.5 flex items-start"><i class="fa-solid fa-gift mr-1.5 mt-0.5 text-xs shrink-0"></i><span>Thuong kem: ${promotionGift}</span></p>
        </div>

        <div class="bg-slate-950/60 p-2.5 rounded text-[10px] text-slate-400 border border-slate-900 leading-relaxed">
          <strong class="text-orange-400"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Diem Danh Doi:</strong> ${tradeOffAnalysis}
        </div>

        <button class="w-full custom-btn-select text-[11px] py-2 rounded font-black transition-colors uppercase bg-slate-900 hover:bg-brand-electric border border-slate-700 text-slate-300 hover:text-white">Khoa Bao Vat Ngay</button>
      </div>`;
  });

  cardsHtml += `</div>`;
  appendAssistantMessage(cardsHtml);

  // Thuong vang khi ket thuc quet thiet bi tu kho hang thanh cong
  modifyPlayerGameStats(20, 'Khai Thac Kho Hang Hoan Tat');

  sessionState.stage = 'INIT';
  sessionState.category = null;
  sessionState.collectedData = { brand: null, budget: null, roomSize: null, familySize: null, purpose: null };

  document.getElementById('chat-stage').textContent = sessionState.stage;
  document.getElementById('latency-val').textContent = Math.round(performance.now() - startTime) + 'ms';
}

// ==========================================
// CÁC HÀM KHỞI TẠO VÀ LÀM MỚI PHIÊN
// ==========================================
window.resetConversation = function() {
  if (activeSessionId) {
    const currentSession = consumerChatSessions.find(item => item.id === activeSessionId);
    if (currentSession && (!currentSession.messages || currentSession.messages.length === 0)) {
      return;
    }
  }

  const newestEmptySession = consumerChatSessions.find(session => !session.messages || session.messages.length === 0);

  if (newestEmptySession) {
    activeSessionId = newestEmptySession.id;
    restoreSessionMessages(newestEmptySession);

    document.getElementById('slang-inspector').textContent = '';
    document.getElementById('rag-catalog-status').textContent = '';
    document.getElementById('rag-promo-status').textContent = '';
    document.getElementById('rag-faq-status').textContent = '';

    renderChatHistoryUI();
  } else {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      chatBox.innerHTML = `
        <div class="flex items-start space-x-3.5 message-fade-in">
          <div class="w-10 h-10 border-2 border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-[inset_0_0_6px_rgba(0,149,218,0.5)]">
            <img src="img/mascot.png" class="w-[90%] h-[90%] object-contain animate-mascot-idle mascot-sprite-node">
          </div>
          <div class="space-y-1 max-w-[85%] w-full">
            <div class="bg-slate-950/90 text-slate-300 rounded-lg px-5 py-3.5 border-2 border-slate-800 text-xs font-mono">
              Dạ, phiên hội thoại tư vấn mua sắm mới đã sẵn sàng phục vụ rồi ạ! Anh/chị cần em hỗ trợ tìm kiếm dòng thiết bị công nghệ điện máy nào thế ạ?
            </div>
          </div>
        </div>`;
    }

    sessionState.stage = 'INIT';
    sessionState.category = null;
    sessionState.collectedData = { brand: null, budget: null, roomSize: null, familySize: null, purpose: null };

    document.getElementById('active-category').textContent = 'Chưa xác định';
    document.getElementById('chat-stage').textContent = 'INIT';
    document.getElementById('slang-inspector').textContent = '';
    document.getElementById('rag-catalog-status').textContent = '';
    document.getElementById('rag-promo-status').textContent = '';
    document.getElementById('rag-faq-status').textContent = '';

    createNewChatSession();
  }
};

window.fillQuickPrompt = function(promptText) {
  const input = document.getElementById('user-input');
  if (input) {
    input.value = promptText;
    input.focus();
  }
};

// ==========================================
// OPERATIONAL ADVANCED SYSTEM GAME LOOPS
// ==========================================
function analyzeStrategicSpellCombos(text) {
  const parsed = extractEntitiesFromText(text);
  let resolvedEntitiesCount = 0;

  if (parsed.category) resolvedEntitiesCount++;
  if (parsed.brand) resolvedEntitiesCount++;
  if (parsed.budget) resolvedEntitiesCount++;
  if (parsed.roomSize || parsed.familySize) resolvedEntitiesCount++;

  // Cap nhat thanh nang luong Mana Point hanh dong
  if (resolvedEntitiesCount >= 2) {
    playerGameState.spellStreak++;
    playerGameState.mpGauge = Math.min(100, playerGameState.mpGauge + 20);
    playerGameState.goldScore += (resolvedEntitiesCount * 40 * playerGameState.spellStreak);

    modifyPlayerGameStats(resolvedEntitiesCount * 12, 'Dai Chieu To Hop Tieu Chi Banh Truong');
    triggerMascotSpriteImpactAnimation();
  } else {
    playerGameState.spellStreak = 0;
    playerGameState.mpGauge = Math.max(10, playerGameState.mpGauge - 15);
  }
  syncDynamicGameHUDIndicators();
}

function modifyPlayerGameStats(xpGained, logicReason) {
  playerGameState.xpCurrent += xpGained;
  playerGameState.goldScore += (xpGained * 8);

  if (playerGameState.xpCurrent >= playerGameState.xpTarget) {
    playerGameState.xpCurrent -= playerGameState.xpTarget;
    playerGameState.level++;
    playerGameState.xpTarget = Math.round(playerGameState.xpTarget * 1.6);
    playerGameState.hpGauge = 100;
    playerGameState.mpGauge = 100;

    setTimeout(() => {
      pushLevelUpNotificationToViewport();
    }, 500);
  }

  syncDynamicGameHUDIndicators();
  spawnFloatingTextNotification(xpGained, logicReason);
}

function markCampaignQuestResolved(questCode) {
  if (playerGameState.campaignQuests[questCode] && !playerGameState.campaignQuests[questCode].done) {
    playerGameState.campaignQuests[questCode].done = true;
    syncDynamicGameHUDIndicators();

    const uiNode = document.getElementById('quest-block-' + questCode);
    if (uiNode) {
      uiNode.className = 'flex justify-between items-center bg-slate-950 p-2 rounded border border-emerald-500/40 text-slate-400 quest-card-resolved';
      const indicator = uiNode.querySelector('.quest-badge-status');
      if (indicator) {
        indicator.className = 'quest-badge-status px-1.5 py-0.5 text-[8px] font-black bg-emerald-950 text-emerald-400 border border-emerald-500 rounded uppercase';
        indicator.textContent = 'Hoan Tat';
      }
    }
  }
}

function syncDynamicGameHUDIndicators() {
  const lvlNode = document.getElementById('game-mascot-level');
  const rankNode = document.getElementById('game-mascot-title');
  const barNode = document.getElementById('game-xp-progress-bar');
  const valNode = document.getElementById('game-xp-text-value');
  const goldNode = document.getElementById('game-score-total');
  const streakNode = document.getElementById('game-streak-multiplier');

  const hpNode = document.getElementById('hud-player-hp-bar');
  const mpNode = document.getElementById('hud-player-mp-bar');

  if (lvlNode) lvlNode.textContent = playerGameState.level;
  if (goldNode) goldNode.textContent = playerGameState.goldScore.toLocaleString();

  if (hpNode) hpNode.style.width = playerGameState.hpGauge + '%';
  if (mpNode) mpNode.style.width = playerGameState.mpGauge + '%';

  if (streakNode) {
    if (playerGameState.spellStreak > 0) {
      streakNode.textContent = 'COMBO X' + playerGameState.spellStreak;
      streakNode.classList.remove('hidden');
    } else {
      streakNode.classList.add('hidden');
    }
  }

  const ratio = Math.min(100, Math.round((playerGameState.xpCurrent / playerGameState.xpTarget) * 100));
  if (barNode) barNode.style.width = ratio + '%';
  if (valNode) valNode.textContent = playerGameState.xpCurrent + '/' + playerGameState.xpTarget + ' XP';

  if (rankNode) {
    if (playerGameState.level === 1) rankNode.textContent = 'Mascot Tan Binh';
    else if (playerGameState.level === 2) rankNode.textContent = 'Mascot Cuong Chien';
    else if (playerGameState.level === 3) rankNode.textContent = 'Mascot Uu Tu';
    else rankNode.textContent = 'Mascot Huyen Thoai Toan Nang';
  }
}

function spawnFloatingTextNotification(xpVal, cause) {
  const referenceContainer = document.getElementById('chat-form');
  if (!referenceContainer) return;

  const node = document.createElement('div');
  node.className = 'absolute bottom-20 left-6 bg-slate-950/95 border-2 border-brand-electric text-slate-200 font-mono text-[10px] font-bold px-3 py-1.5 rounded shadow-2xl pointer-events-none z-50 animate-score-popup flex items-center space-x-1';
  node.innerHTML = `<i class="fa-solid fa-bolt text-amber-400 mr-1"></i><span>+${xpVal} XP: ${cause}</span>`;

  referenceContainer.appendChild(node);
  setTimeout(() => { node.remove(); }, 1400);
}

function pushLevelUpNotificationToViewport() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  const html = `
    <div class="flex items-center justify-center py-2 message-fade-in select-none">
      <div class="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-y-2 border-brand-electric w-full text-center py-3 px-4 shadow-[0_0_15px_rgba(0,149,218,0.3)]">
        <p class="text-xs font-black tracking-widest text-brand-electric font-mono uppercase">
          <i class="fa-solid fa-angles-up mr-2 text-brand-electric animate-bounce"></i>
          DANG CAP TIEN HOA - LINH HON MASCOT DAT TOC DO CAP: ${playerGameState.level}
        </p>
        <p class="text-[9px] font-mono text-slate-500 mt-1 uppercase">Thuoc tinh cu dan da dat trang thai toan man. Suc dung quet quac an duoc cuong hoa!</p>
      </div>
    </div>`;
  chatBox.insertAdjacentHTML('beforeend', html);
  scrollChatToBottom();
  triggerMascotSpriteImpactAnimation();
}

function applyCurrentDynamicMascotAura() {
  const targetAvatars = document.querySelectorAll('#live-dynamic-avatar-node');
  targetAvatars.forEach(img => {
    if (playerGameState.level >= 2) {
      img.classList.add('mascot-epic-glow');
    } else {
      img.classList.remove('mascot-epic-glow');
    }
  });
}

// ĐỒNG BỘ KHỞI TẠO KHI TẢI TRANG HOÀN TẤT
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  if (form) form.addEventListener('submit', handleFormSubmit);

  initCollapsibleSidebarLogic();
  syncDynamicGameHUDIndicators();

  const allElements = document.getElementsByTagName('*');
  for (let el of allElements) {
    if (el.textContent.trim().startsWith('Dữ liệu bảo mật') && el.children.length === 0) {
      el.style.textAlign = 'left';
      el.style.display = 'block';
      if (el.parentElement) {
        el.parentElement.style.display = 'flex';
        el.parentElement.style.flexDirection = 'column';
        el.parentElement.style.alignItems = 'flex-start';
        el.parentElement.style.textAlign = 'left';
        el.parentElement.style.paddingLeft = '0';
        el.parentElement.style.marginLeft = '0';
      }
    }
  }

  createNewChatSession();
});

// ==========================================
// INJECT NEW DYNAMIC MASCOT ANIMATIONS (FLOATING & VIOLENT BOUNCE)
// ==========================================
(function injectHeaderMascotAnimations() {
  if (document.getElementById('header-mascot-animations')) return;
  const style = document.createElement('style');
  style.id = 'header-mascot-animations';
  style.innerHTML = `
    @keyframes orbFloatGlow {
      0%, 100% {
        transform: translateY(0) scale(1);
        filter: drop-shadow(0 4px 8px rgba(0,149,218,0.25));
      }
      50% {
        transform: translateY(-5px) scale(1.05);
        filter: drop-shadow(0 12px 20px rgba(0,149,218,0.55));
      }
    }
    .animate-glowing-orb {
      animation: orbFloatGlow 3s ease-in-out infinite !important;
      will-change: transform, filter;
    }
    @keyframes violentBounce {
      0%, 100% { transform: translateY(0) scale(1); }
      10% { transform: translateY(-30px) scaleY(1.3) scaleX(0.85); }
      20% { transform: translateY(22px) scaleY(0.7) scaleX(1.25); }
      30% { transform: translateY(-22px) scaleY(1.15) scaleX(0.9); }
      40% { transform: translateY(16px) scaleY(0.85) scaleX(1.1); }
      50% { transform: translateY(-12px) scaleY(1.05); }
      60% { transform: translateY(10px) scaleY(0.95); }
      70% { transform: translateY(-6px); }
      80% { transform: translateY(4px); }
      90% { transform: translateY(-1px); }
    }
    .animate-violent-bounce {
      animation: violentBounce 1s cubic-bezier(.36,.07,.19,.97) both !important;
      will-change: transform;
    }
  `;
  document.head.appendChild(style);
})();
