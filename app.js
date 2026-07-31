/**
 * OlaClick Dashboard Replica - JavaScript
 * Interações e funcionalidades do dashboard
 */

(function() {
  'use strict';

  // ========================================
  // DOM READY
  // ========================================
  document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initFilters();
    initBanner();
    initActionButtons();
    initSortableHeaders();
    initPagination();
    initTooltips();
    initKeyboardShortcuts();
    console.log('🚀 OlaClick Dashboard initialized');
  });

  // ========================================
  // TABS
  // ========================================
  function initTabs() {
    const tabs = document.querySelectorAll('.orders-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // Animate table refresh
        const tableContainer = document.querySelector('.data-table-container');
        if (tableContainer) {
          tableContainer.style.opacity = '0.5';
          setTimeout(() => {
            tableContainer.style.opacity = '1';
          }, 200);
        }
      });
    });
  }

  // ========================================
  // FILTERS
  // ========================================
  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Simulate filter
        const filterText = this.textContent.trim();
        console.log('Filter applied:', filterText);

        // Visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = 'scale(1)', 100);
      });
    });
  }

  // ========================================
  // BANNER
  // ========================================
  function initBanner() {
    const closeBtn = document.querySelector('.cashier-banner__close');
    const banner = document.querySelector('.cashier-banner');
    const openBtn = document.querySelector('.cashier-banner__btn');
    const disableLink = document.querySelector('.cashier-banner__link');

    if (closeBtn && banner) {
      closeBtn.addEventListener('click', function() {
        banner.style.transition = 'all 0.3s ease';
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          banner.style.display = 'none';
        }, 300);
      });
    }

    if (openBtn) {
      openBtn.addEventListener('click', function() {
        showToast('Caixa aberto com sucesso!', 'success');
        if (banner) {
          banner.style.transition = 'all 0.3s ease';
          banner.style.opacity = '0';
          setTimeout(() => banner.style.display = 'none', 300);
        }
      });
    }

    if (disableLink) {
      disableLink.addEventListener('click', function(e) {
        e.preventDefault();
        showToast('Aviso automático desativado', 'info');
      });
    }
  }

  // ========================================
  // ACTION BUTTONS
  // ========================================
  function initActionButtons() {
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();

        // Click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = 'scale(1)', 100);

        // Get action type
        const tooltip = this.getAttribute('data-tooltip');
        if (tooltip) {
          console.log('Action:', tooltip);

          switch(tooltip) {
            case 'Finalizar':
              if (confirm('Deseja finalizar este pedido?')) {
                showToast('Pedido finalizado!', 'success');
                // Animate row removal
                const row = this.closest('tr');
                if (row) {
                  row.style.transition = 'all 0.3s ease';
                  row.style.opacity = '0';
                  row.style.transform = 'translateX(20px)';
                  setTimeout(() => row.remove(), 300);
                }
              }
              break;
            case 'Pagar':
              showToast('Redirecionando para pagamento...', 'info');
              break;
            case 'Imprimir':
              showToast('Enviando para impressão...', 'info');
              break;
            case 'Status':
              showToast('Status atualizado', 'success');
              break;
            default:
              showToast(tooltip + ' - Em desenvolvimento', 'info');
          }
        }
      });
    });

    // New order button
    const newOrderBtn = document.querySelector('.new-order-btn');
    if (newOrderBtn) {
      newOrderBtn.addEventListener('click', function() {
        showToast('Novo pedido - Em desenvolvimento', 'info');
      });
    }

    // Finish all
    const finishAllBtn = document.querySelector('.finish-all-btn');
    if (finishAllBtn) {
      finishAllBtn.addEventListener('click', function() {
        if (confirm('Deseja finalizar todos os pedidos?')) {
          showToast('Todos os pedidos foram finalizados!', 'success');
        }
      });
    }
  }

  // ========================================
  // SORTABLE HEADERS
  // ========================================
  function initSortableHeaders() {
    const headers = document.querySelectorAll('.data-table th.sortable');
    headers.forEach(header => {
      header.addEventListener('click', function() {
        const isAsc = !this.classList.contains('sort-asc');

        // Reset all headers
        headers.forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
          h.style.color = '';
        });

        // Set current
        this.classList.add(isAsc ? 'sort-asc' : 'sort-desc');
        this.style.color = 'var(--primary)';

        // Update arrow
        this.querySelector('::after') || (this.style.setProperty('--sort-icon', isAsc ? '↑' : '↓'));

        showToast(`Ordenado por ${this.textContent.trim()}`, 'info');
      });
    });
  }

  // ========================================
  // PAGINATION
  // ========================================
  function initPagination() {
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
      if (!btn.disabled) {
        btn.addEventListener('click', function() {
          this.style.transform = 'scale(0.9)';
          setTimeout(() => this.style.transform = 'scale(1)', 100);
        });
      }
    });
  }

  // ========================================
  // TOOLTIPS ENHANCEMENT
  // ========================================
  function initTooltips() {
    // Mobile: hide tooltips on touch devices
    if ('ontouchstart' in window) {
      document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.removeAttribute('data-tooltip');
      });
    }
  }

  // ========================================
  // KEYBOARD SHORTCUTS
  // ========================================
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + K = Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showToast('Busca - Em desenvolvimento', 'info');
      }

      // Ctrl/Cmd + N = New Order
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const newOrderBtn = document.querySelector('.new-order-btn');
        if (newOrderBtn) newOrderBtn.click();
      }

      // Escape = Close banner
      if (e.key === 'Escape') {
        const closeBtn = document.querySelector('.cashier-banner__close');
        if (closeBtn && document.querySelector('.cashier-banner').style.display !== 'none') {
          closeBtn.click();
        }
      }
    });
  }

  // ========================================
  // TOAST NOTIFICATIONS
  // ========================================
  function showToast(message, type = 'info') {
    // Remove existing toasts
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';

    const colors = {
      success: '#3CAF47',
      error: '#FE5F55',
      warning: '#FF9800',
      info: '#006FFF'
    };

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <span style="margin-right:8px">${icons[type]}</span>
      ${message}
    `;

    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: ${colors[type]};
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      display: flex;
      align-items: center;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Add toast animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ========================================
  // DRAG & DROP (Tabs)
  // ========================================
  let draggedTab = null;

  document.querySelectorAll('.orders-tab').forEach(tab => {
    const handle = tab.querySelector('.drag-handle');
    if (handle) {
      handle.addEventListener('mousedown', function(e) {
        draggedTab = tab;
        tab.style.cursor = 'grabbing';
        tab.style.opacity = '0.8';
      });
    }
  });

  document.addEventListener('mouseup', function() {
    if (draggedTab) {
      draggedTab.style.cursor = '';
      draggedTab.style.opacity = '';
      draggedTab = null;
    }
  });

  // ========================================
  // REFRESH BUTTON
  // ========================================
  const refreshBtn = document.querySelector('.toolbar-btn[data-tooltip="Atualizar"]');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      const icon = this.querySelector('.mdi');
      if (icon) {
        icon.style.animation = 'spin 1s linear';
        setTimeout(() => icon.style.animation = '', 1000);
      }
      showToast('Dados atualizados!', 'success');
    });
  }

  // Add spin animation
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinStyle);

})();
