/* ============================================================
   Cardápio Digital - Produtos e Combos
   Lógica principal (app.js)
   ============================================================ */

const app = {
  products: [],
  combos: [],
  currentTab: 'products',
  editingId: null,
  searchQuery: '',
  comboSelectedProducts: [],

  init() {
    this.loadData();
    if (this.products.length === 0) this.seedData();
    this.render();
  },

  loadData() {
    try {
      const p = localStorage.getItem('cardapio_products');
      const c = localStorage.getItem('cardapio_combos');
      if (p) this.products = JSON.parse(p);
      if (c) this.combos = JSON.parse(c);
    } catch(e) { console.error(e); }
  },

  saveData() {
    localStorage.setItem('cardapio_products', JSON.stringify(this.products));
    localStorage.setItem('cardapio_combos', JSON.stringify(this.combos));
  },

  seedData() {
    this.products = [
      { id: 1, name: 'Batatinha frita', desc: 'Porção de batatas fritas crocantes', price: 20.00, visible: true, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=100&h=100&fit=crop' },
      { id: 2, name: 'Batata especial', desc: 'Batata com cheddar e bacon', price: 40.00, visible: false, image: '' },
      { id: 3, name: 'Hot-dog Gourmet', desc: 'Salsicha artesanal com molhos especiais', price: 15.00, visible: false, image: '' },
      { id: 4, name: 'Hot dog Tradicional', desc: 'O clássico que todo mundo ama', price: 15.00, visible: true, image: '' },
      { id: 5, name: 'Hot dog Strogonoff', desc: 'Hot dog com strogonoff de carne', price: 15.00, visible: false, image: '' },
      { id: 6, name: 'Artesanal', desc: 'Hambúrguer artesanal 180g', price: 20.00, visible: false, image: '' },
      { id: 7, name: 'Hambúrguer Duplo', desc: 'Dois hambúrgueres artesanais', price: 33.00, visible: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop' },
      { id: 8, name: 'X-tudo', desc: 'Pão bola, Carne, Queijo, Presunto, Salsicha, Ovo, Calabresa, Bacon, Cebola, Tomate e Alface', price: 23.00, visible: true, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=100&h=100&fit=crop' },
    ];
    this.combos = [
      { id: 1, name: 'Combo Família', desc: '2 hambúrgueres + batata grande + 2 refrigerantes', price: 65.00, visible: true, productIds: [7, 1], image: '' },
    ];
    this.saveData();
  },

  getNextId(list) {
    if (list.length === 0) return 1;
    return Math.max(...list.map(x => x.id)) + 1;
  },

  setTab(tab) {
    this.currentTab = tab;
    this.searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    const btnAdd = document.getElementById('btn-add');
    if (tab === 'combos') {
      btnAdd.innerHTML = '<span>+</span> Novo Combo';
      document.getElementById('content-title').textContent = 'Combos';
    } else {
      btnAdd.innerHTML = '<span>+</span> Novo Produto';
      document.getElementById('content-title').textContent = 'Produtos';
    }
    this.render();
  },

  search(q) {
    this.searchQuery = q.toLowerCase().trim();
    this.render();
  },

  getFiltered() {
    const list = this.currentTab === 'products' ? this.products : this.combos;
    if (!this.searchQuery) return list;
    return list.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery) ||
      (item.desc && item.desc.toLowerCase().includes(this.searchQuery))
    );
  },

  render() {
    document.getElementById('badge-products').textContent = this.products.length;
    document.getElementById('badge-combos').textContent = this.combos.length;

    const list = this.getFiltered();
    document.getElementById('content-count').textContent = `${list.length} item${list.length !== 1 ? 's' : ''} cadastrado${list.length !== 1 ? 's' : ''}`;

    const container = document.getElementById('productList');
    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${this.currentTab === 'products' ? '🍽️' : '🎁'}</div>
          <div class="empty-state-title">Nenhum ${this.currentTab === 'products' ? 'produto' : 'combo'} encontrado</div>
          <div class="empty-state-desc">Clique em "Novo" para começar a cadastrar.</div>
        </div>`;
      return;
    }

    container.innerHTML = list.map(item => {
      const isCombo = this.currentTab === 'combos';
      const img = item.image
        ? `<img src="${item.image}" class="product-img" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        : '';
      const placeholder = `<div class="product-img-placeholder">${isCombo ? '🎁' : '🍔'}</div>`;
      const comboInfo = isCombo && item.productIds
        ? `<span style="color:var(--primary);font-weight:600;">• ${item.productIds.length} produto${item.productIds.length !== 1 ? 's' : ''}</span>`
        : '';

      return `
        <div class="product-item">
          ${img}${!item.image ? placeholder : placeholder.replace('style="display:flex"', 'style="display:none"')}
          <div class="product-info">
            <div class="product-name">${this.escapeHtml(item.name)} ${item.visible ? '' : '<span style="color:var(--gray-300);font-size:0.75rem;font-weight:500;">(oculto)</span>'}</div>
            <div class="product-desc">${this.escapeHtml(item.desc || '')} ${comboInfo}</div>
          </div>
          <div class="product-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
          <div class="product-actions">
            <button class="visibility-toggle ${item.visible ? 'visible' : 'hidden'}" onclick="app.toggleVisibility(${item.id})" title="${item.visible ? 'Ocultar' : 'Mostrar'}">
              ${item.visible
                ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'
                : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26"/><path d="M2 2l20 20"/></svg>'}
            </button>
            <div style="position:relative;">
              <button class="menu-btn" onclick="app.toggleDropdown(this, ${item.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
              <div class="dropdown-menu" id="dropdown-${item.id}">
                <div class="dropdown-item" onclick="app.edit(${item.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  Editar
                </div>
                <div class="dropdown-item delete" onclick="app.delete(${item.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  Excluir
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  toggleVisibility(id) {
    const list = this.currentTab === 'products' ? this.products : this.combos;
    const item = list.find(x => x.id === id);
    if (item) {
      item.visible = !item.visible;
      this.saveData();
      this.render();
      this.toast(item.visible ? 'Item visível no cardápio' : 'Item oculto do cardápio', 'info');
    }
  },

  toggleDropdown(btn, id) {
    document.querySelectorAll('.dropdown-menu').forEach(d => {
      if (d.id !== 'dropdown-' + id) d.classList.remove('show');
    });
    const dd = document.getElementById('dropdown-' + id);
    dd.classList.toggle('show');
  },

  openModal(id = null) {
    this.editingId = id;
    const isCombo = this.currentTab === 'combos';
    const isEdit = id !== null;

    if (isCombo) {
      document.getElementById('modalTitle').textContent = isEdit ? 'Editar Combo' : 'Novo Combo';
      this.comboSelectedProducts = [];
      if (isEdit) {
        const combo = this.combos.find(c => c.id === id);
        if (combo) this.comboSelectedProducts = [...(combo.productIds || [])];
      }
    } else {
      document.getElementById('modalTitle').textContent = isEdit ? 'Editar Produto' : 'Novo Produto';
    }

    document.getElementById('modalBody').innerHTML = this.buildForm(isCombo, isEdit);
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';

    if (isCombo) this.renderComboSelector();
  },

  buildForm(isCombo, isEdit) {
    let item = null;
    if (isEdit) {
      item = isCombo
        ? this.combos.find(c => c.id === this.editingId)
        : this.products.find(p => p.id === this.editingId);
    }

    const imgPreview = item?.image || '';
    const imgClass = imgPreview ? 'has-image' : '';

    return `
      <div class="form-group">
        <div class="image-upload ${imgClass}" id="imgUpload" onclick="document.getElementById('imgInput').click()">
          ${imgPreview ? `<img src="${imgPreview}" id="imgPreview">` : ''}
          <div class="image-upload-overlay">Alterar imagem</div>
          <div class="image-upload-icon" id="imgIcon" style="${imgPreview ? 'display:none' : ''}">📷</div>
          <div class="image-upload-text" id="imgText" style="${imgPreview ? 'display:none' : ''}">Clique para adicionar imagem</div>
          <div class="image-upload-hint" id="imgHint" style="${imgPreview ? 'display:none' : ''}">URL da imagem ou deixe em branco</div>
        </div>
        <input type="text" class="form-input" id="imgInput" placeholder="https://..." value="${imgPreview}" oninput="app.updateImagePreview(this.value)" style="margin-top:0.5rem;">
      </div>

      <div class="form-group">
        <label class="form-label">Nome <span class="required">*</span></label>
        <input type="text" class="form-input" id="fieldName" placeholder="Ex: X-tudo" value="${item ? this.escapeHtml(item.name) : ''}">
        <div class="form-error" id="errName">Informe o nome.</div>
      </div>

      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="fieldDesc" placeholder="Ingredientes, detalhes...">${item ? this.escapeHtml(item.desc || '') : ''}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Preço (R$) <span class="required">*</span></label>
          <input type="number" class="form-input" id="fieldPrice" placeholder="0,00" step="0.01" min="0" value="${item ? item.price : ''}">
          <div class="form-error" id="errPrice">Informe um preço válido.</div>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="fieldVisible">
            <option value="true" ${!item || item.visible ? 'selected' : ''}>✅ Disponível</option>
            <option value="false" ${item && !item.visible ? 'selected' : ''}>🚫 Oculto</option>
          </select>
        </div>
      </div>

      ${isCombo ? `
      <div class="combo-section">
        <div class="combo-section-title">🛒 Produtos do Combo</div>
        <div class="form-hint" style="margin-bottom:0.5rem;">Selecione os produtos que compõem este combo:</div>
        <div class="combo-products-grid" id="comboGrid"></div>
        <div class="combo-selected-list" id="comboSelectedList"></div>
        <div class="combo-summary">
          <div class="combo-summary-label">Total dos produtos selecionados:</div>
          <div class="combo-summary-value" id="comboTotal">R$ 0,00</div>
        </div>
        <div class="form-error" id="errCombo">Selecione pelo menos um produto para o combo.</div>
      </div>
      ` : ''}
    `;
  },

  updateImagePreview(url) {
    const upload = document.getElementById('imgUpload');
    const preview = document.getElementById('imgPreview');
    const icon = document.getElementById('imgIcon');
    const text = document.getElementById('imgText');
    const hint = document.getElementById('imgHint');

    if (url.trim()) {
      if (preview) preview.src = url;
      else {
        const img = document.createElement('img');
        img.src = url;
        img.id = 'imgPreview';
        upload.insertBefore(img, upload.firstChild);
      }
      upload.classList.add('has-image');
      if (icon) icon.style.display = 'none';
      if (text) text.style.display = 'none';
      if (hint) hint.style.display = 'none';
    } else {
      const existing = document.getElementById('imgPreview');
      if (existing) existing.remove();
      upload.classList.remove('has-image');
      if (icon) icon.style.display = '';
      if (text) text.style.display = '';
      if (hint) hint.style.display = '';
    }
  },

  renderComboSelector() {
    const grid = document.getElementById('comboGrid');
    const list = document.getElementById('comboSelectedList');
    if (!grid) return;

    grid.innerHTML = this.products.map(p => {
      const selected = this.comboSelectedProducts.includes(p.id);
      return `
        <div class="combo-product-card ${selected ? 'selected' : ''}" onclick="app.toggleComboProduct(${p.id})">
          ${p.image ? `<img src="${p.image}" class="cp-img" onerror="this.style.display='none'">` : `<div class="cp-img" style="display:flex;align-items:center;justify-content:center;background:var(--gray-100);font-size:1.25rem;">🍔</div>`}
          <div class="cp-name">${this.escapeHtml(p.name)}</div>
          <div class="cp-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
        </div>`;
    }).join('');

    const selected = this.products.filter(p => this.comboSelectedProducts.includes(p.id));
    list.innerHTML = selected.map(p => `
      <div class="combo-selected-item">
        <span class="csi-name">${this.escapeHtml(p.name)}</span>
        <span class="csi-price">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
        <button class="csi-remove" onclick="app.toggleComboProduct(${p.id})">&times;</button>
      </div>
    `).join('');

    const total = selected.reduce((sum, p) => sum + p.price, 0);
    document.getElementById('comboTotal').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
  },

  toggleComboProduct(id) {
    if (this.comboSelectedProducts.includes(id)) {
      this.comboSelectedProducts = this.comboSelectedProducts.filter(x => x !== id);
    } else {
      this.comboSelectedProducts.push(id);
    }
    this.renderComboSelector();
  },

  closeModal(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('modalOverlay').classList.remove('show');
    document.body.style.overflow = '';
    this.editingId = null;
    this.comboSelectedProducts = [];
    document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
  },

  validate() {
    let valid = true;
    const name = document.getElementById('fieldName').value.trim();
    const price = parseFloat(document.getElementById('fieldPrice').value);

    document.querySelectorAll('.form-error').forEach(e => e.classList.remove('show'));

    if (!name) { document.getElementById('errName').classList.add('show'); valid = false; }
    if (isNaN(price) || price < 0) { document.getElementById('errPrice').classList.add('show'); valid = false; }

    if (this.currentTab === 'combos' && this.comboSelectedProducts.length === 0) {
      document.getElementById('errCombo').classList.add('show'); valid = false;
    }

    return valid;
  },

  save() {
    if (!this.validate()) return;

    const name = document.getElementById('fieldName').value.trim();
    const desc = document.getElementById('fieldDesc').value.trim();
    const price = parseFloat(document.getElementById('fieldPrice').value);
    const visible = document.getElementById('fieldVisible').value === 'true';
    const image = document.getElementById('imgInput').value.trim();

    if (this.currentTab === 'products') {
      if (this.editingId) {
        const p = this.products.find(x => x.id === this.editingId);
        if (p) { p.name = name; p.desc = desc; p.price = price; p.visible = visible; p.image = image; }
        this.toast('Produto atualizado com sucesso!');
      } else {
        this.products.push({ id: this.getNextId(this.products), name, desc, price, visible, image });
        this.toast('Produto cadastrado com sucesso!');
      }
    } else {
      if (this.editingId) {
        const c = this.combos.find(x => x.id === this.editingId);
        if (c) { c.name = name; c.desc = desc; c.price = price; c.visible = visible; c.image = image; c.productIds = [...this.comboSelectedProducts]; }
        this.toast('Combo atualizado com sucesso!');
      } else {
        this.combos.push({ id: this.getNextId(this.combos), name, desc, price, visible, image, productIds: [...this.comboSelectedProducts] });
        this.toast('Combo cadastrado com sucesso!');
      }
    }

    this.saveData();
    this.closeModal();
    this.render();
  },

  edit(id) {
    document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
    this.openModal(id);
  },

  delete(id) {
    document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
    const isCombo = this.currentTab === 'combos';
    const name = isCombo
      ? this.combos.find(c => c.id === id)?.name
      : this.products.find(p => p.id === id)?.name;

    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;

    if (isCombo) {
      this.combos = this.combos.filter(c => c.id !== id);
    } else {
      // Remove product from any combos that reference it
      this.combos.forEach(c => {
        if (c.productIds) c.productIds = c.productIds.filter(pid => pid !== id);
      });
      this.products = this.products.filter(p => p.id !== id);
    }

    this.saveData();
    this.render();
    this.toast(`${isCombo ? 'Combo' : 'Produto'} excluído com sucesso!`);
  },

  toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'error' ? '❌' : type === 'info' ? 'ℹ️' : '✅';
    toast.innerHTML = `<span>${icon}</span> ${this.escapeHtml(message)}`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  },

  exportData() {
    const data = { products: this.products, combos: this.combos, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cardapio-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Dados exportados com sucesso!');
  },

  importData(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.products) this.products = data.products;
        if (data.combos) this.combos = data.combos;
        this.saveData();
        this.render();
        this.toast('Dados importados com sucesso!');
      } catch (err) {
        this.toast('Erro ao importar arquivo. Verifique o formato.', 'error');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }
};

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-btn') && !e.target.closest('.dropdown-menu')) {
    document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
  }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') app.closeModal();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => app.init());
