/**
 * OlaClick Dashboard - Application Logic
 */

// ============================================
// DATA
// ============================================
const ordersData = [
  {
    id: 1,
    dailyId: 'BR-8357',
    type: 'counter',
    typeLabel: 'No local',
    typeIcon: 'storefront',
    status: 'delivered',
    statusLabel: 'Entregue',
    source: 'PDV',
    total: 23.00,
    paymentStatus: 'unpaid',
    paymentLabel: 'Não pago',
    clientName: 'Sandra Pyetro',
    clientPhone: '+55 9491785734',
    owner: 'Nelia Paula',
    date: '04/07/26',
    time: '19:06',
    timer: '60:00 min',
    timerColor: 'error'
  },
  {
    id: 6,
    dailyId: 'BR-9735',
    type: 'pickup',
    typeLabel: 'Retirada',
    typeIcon: 'package-variant',
    status: 'delivered',
    statusLabel: 'Entregue',
    source: 'PDV',
    total: 34.00,
    paymentStatus: 'unpaid',
    paymentLabel: 'Não pago',
    clientName: 'Kelly Palmeira',
    clientPhone: '+55 94992049598',
    owner: 'Nelia Paula',
    date: '14/11/25',
    time: '22:22',
    timer: '60:00 min',
    timerColor: 'error'
  }
];

let currentFilter = 'all';
let currentTab = 'counter';

// ============================================
// DOM ELEMENTS
// ============================================
const els = {
  ordersTbody: document.getElementById('orders-tbody'),
  totalValue: document.getElementById('total-value'),
  cashierBanner: document.getElementById('cashier-banner'),
  closeBanner: document.getElementById('close-banner'),
  openCashier: document.getElementById('open-cashier'),
  disableWarning: document.getElementById('disable-warning'),
  tabs: document.querySelectorAll('.orders-tab'),
  filterChips: document.querySelectorAll('.filter-chip'),
  newOrderBtn: document.getElementById('new-order-btn'),
  modalOverlay: document.getElementById('modal-overlay'),
  newOrderModal: document.getElementById('new-order-modal'),
  toastContainer: document.getElementById('toast-container'),
  itemsPerPage: document.getElementById('items-per-page'),
  paginationInfo: document.getElementById('pagination-info'),
  btnRefresh: document.getElementById('btn-refresh'),
  btnSearch: document.getElementById('btn-search'),
  btnPause: document.getElementById('btn-pause'),
  finishAllBtn: document.getElementById('finish-all-btn'),
  navItems: document.querySelectorAll('.nav-item.has-submenu'),
  sidebar: document.getElementById('sidebar')
};

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderOrders() {
  let filtered = ordersData;

  if (currentFilter !== 'all') {
    filtered = ordersData.filter(o => {
      if (currentFilter === 'pending') return o.status === 'pending';
      if (currentFilter === 'ongoing') return o.status === 'ongoing';
      if (currentFilter === 'pdv') return o.source === 'PDV';
      if (currentFilter === 'apps') return o.source !== 'PDV';
      return true;
    });
  }

  els.ordersTbody.innerHTML = filtered.map(order => `
    <tr data-order-id="${order.id}">
      <td>
        <div class="order-id">#${order.id}</div>
        <div class="order-type">
          <span class="mdi mdi-${order.typeIcon}" style="font-size:14px"></span>
          ${order.typeLabel}
        </div>
        <div class="order-timer">
          <span class="mdi mdi-clock-alert-outline" style="font-size:14px"></span>
          ${order.timer}
        </div>
        <div class="order-date">
          <span class="mdi mdi-calendar" style="font-size:14px"></span>
          ${order.date} ${order.time}
        </div>
      </td>
      <td>
        <div class="chip-status ${order.status}">${order.statusLabel}</div>
        <div class="chip-source">${order.source}</div>
        <div class="order-owner">
          <span class="mdi mdi-account" style="font-size:14px;color:#28B84F"></span>
          ${order.owner}
        </div>
      </td>
      <td>
        <div style="font-weight:700;font-size:15px">R$ ${order.total.toFixed(2).replace('.', ',')}</div>
        <div class="chip-payment ${order.paymentStatus === 'paid' ? 'paid' : ''}">${order.paymentLabel}</div>
      </td>
      <td>
        <div class="client-name">${order.clientName}</div>
        <div class="client-phone" onclick="copyPhone('${order.clientPhone}')">
          <span class="mdi mdi-whatsapp" style="font-size:14px"></span>
          ${order.clientPhone}
          <span class="mdi mdi-menu-down"></span>
        </div>
      </td>
      <td>
        <div class="actions-cell">
          <button class="action-btn icon-only" data-tooltip="Imprimir" onclick="printOrder(${order.id})">
            <span class="mdi mdi-printer-outline"></span>
          </button>
          <button class="action-btn" data-tooltip="Status" onclick="changeStatus(${order.id})">
            <span class="mdi mdi-clock-outline"></span>
            Status
          </button>
          <button class="action-btn primary" data-tooltip="Pagar" onclick="payOrder(${order.id})">
            <span class="mdi mdi-currency-usd"></span>
            Pagar
          </button>
          <button class="action-btn success" data-tooltip="Finalizar" onclick="finishOrder(${order.id})">
            <span class="mdi mdi-check"></span>
            Finalizar
          </button>
          <button class="action-btn icon-only" data-tooltip="Mais" onclick="moreOptions(${order.id})">
            <span class="mdi mdi-dots-vertical"></span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  const total = filtered.reduce((sum, o) => sum + o.total, 0);
  els.totalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  els.paginationInfo.textContent = `1-${filtered.length} of ${filtered.length}`;
}

// ============================================
// ACTIONS
// ============================================
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    info: 'information-outline',
    success: 'check-circle',
    error: 'alert-circle',
    warning: 'alert'
  };

  toast.innerHTML = `
    <span class="mdi mdi-${icons[type] || icons.info}"></span>
    <span>${message}</span>
  `;

  els.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

function openModal(modal) {
  els.modalOverlay.classList.add('active');
  modal.classList.add('active');
}

function closeModal() {
  els.modalOverlay.classList.remove('active');
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
}

function copyPhone(phone) {
  navigator.clipboard?.writeText(phone);
  showToast(`Telefone copiado: ${phone}`, 'success');
}

function printOrder(id) {
  showToast(`Imprimindo pedido #${id}...`, 'info');
  setTimeout(() => showToast(`Pedido #${id} enviado para impressão!`, 'success'), 1000);
}

function changeStatus(id) {
  showToast(`Alterando status do pedido #${id}...`, 'info');
}

function payOrder(id) {
  const order = ordersData.find(o => o.id === id);
  if (order) {
    order.paymentStatus = 'paid';
    order.paymentLabel = 'Pago';
    renderOrders();
    showToast(`Pedido #${id} marcado como pago!`, 'success');
  }
}

function finishOrder(id) {
  const order = ordersData.find(o => o.id === id);
  if (order) {
    order.status = 'delivered';
    order.statusLabel = 'Finalizado';
    renderOrders();
    showToast(`Pedido #${id} finalizado com sucesso!`, 'success');
  }
}

function moreOptions(id) {
  showToast(`Opções do pedido #${id}`, 'info');
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
  // Tabs
  els.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      els.tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      showToast(`Aba "${tab.querySelector('.tab-label')?.textContent || tab.dataset.tab}" selecionada`, 'info', 1500);
    });
  });

  // Filter chips
  els.filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      els.filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderOrders();
    });
  });

  // Cashier banner
  els.closeBanner.addEventListener('click', () => {
    els.cashierBanner.style.display = 'none';
  });

  els.openCashier.addEventListener('click', () => {
    showToast('Abrindo caixa...', 'info');
    setTimeout(() => {
      els.cashierBanner.style.display = 'none';
      showToast('Caixa aberto com sucesso!', 'success');
    }, 1500);
  });

  els.disableWarning.addEventListener('click', () => {
    els.cashierBanner.style.display = 'none';
    showToast('Aviso desativado', 'info');
  });

  // New order
  els.newOrderBtn.addEventListener('click', () => {
    openModal(els.newOrderModal);
  });

  els.modalOverlay.addEventListener('click', closeModal);

  document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Toolbar buttons
  els.btnRefresh.addEventListener('click', () => {
    const icon = els.btnRefresh.querySelector('.mdi');
    icon.classList.add('mdi-spin');
    showToast('Atualizando pedidos...', 'info');
    setTimeout(() => {
      icon.classList.remove('mdi-spin');
      renderOrders();
      showToast('Pedidos atualizados!', 'success');
    }, 1000);
  });

  els.btnSearch.addEventListener('click', () => {
    showToast('Busca de pedidos em breve!', 'info');
  });

  els.btnPause.addEventListener('click', () => {
    showToast('Pedidos pausados', 'warning');
  });

  els.finishAllBtn.addEventListener('click', () => {
    if (confirm('Finalizar todos os pedidos em curso?')) {
      ordersData.forEach(o => {
        if (o.status !== 'delivered') {
          o.status = 'delivered';
          o.statusLabel = 'Finalizado';
        }
      });
      renderOrders();
      showToast('Todos os pedidos finalizados!', 'success');
    }
  });

  // Sidebar submenus
  els.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const submenu = item.nextElementSibling;
      if (submenu && submenu.classList.contains('submenu')) {
        item.classList.toggle('expanded');
        submenu.classList.toggle('open');
      }
    });
  });

  // Items per page
  els.itemsPerPage.addEventListener('change', (e) => {
    showToast(`Exibindo ${e.target.value} itens por página`, 'info', 1500);
  });

  // Sortable headers
  document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const icon = th.querySelector('.sort-icon');
      icon.classList.toggle('mdi-arrow-up');
      icon.classList.toggle('mdi-arrow-down');
      showToast(`Ordenado por ${th.dataset.sort}`, 'info', 1500);
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      openModal(els.newOrderModal);
    }
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
  initEventListeners();

  // Welcome toast
  setTimeout(() => {
    showToast('Bem-vindo ao Dashboard OlaClick!', 'success');
  }, 500);
});
