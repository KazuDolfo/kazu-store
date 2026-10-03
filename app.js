/**
 * KazuStore Perú - Lógica Frontend Vanilla Modular
 * Búsqueda reactiva, filtrado multidimensional, modal a11y y enlaces inteligentes a WhatsApp.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Estado reactivo de la aplicación
  const state = {
    searchQuery: '',
    selectedCategory: 'all',
    selectedAccess: 'all',
    sortBy: 'featured',
    activeModalProduct: null
  };

  // 2. Selectores del DOM
  const productsGrid = document.getElementById('products-grid');
  const productsCounter = document.getElementById('products-counter');
  const emptyState = document.getElementById('empty-state');
  const globalSearchInput = document.getElementById('global-search');
  const categoryButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');
  const accessSelect = document.getElementById('access-select');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  // Actualizar enlaces globales de WhatsApp (Header y Footer) desde KAZU_CONFIG
  const phone = KAZU_CONFIG.whatsappNumber;
  const headerWaBtn = document.querySelector('.btn-whatsapp-header');
  const footerWaBtn = document.querySelector('.btn-whatsapp-footer');
  if (headerWaBtn) {
    headerWaBtn.href = `https://wa.me/${phone}?text=Hola%20${encodeURIComponent(KAZU_CONFIG.storeName)},%20deseo%20consultar%20por%20sus%20servicios`;
  }
  if (footerWaBtn) {
    footerWaBtn.href = `https://wa.me/${phone}?text=Hola%20${encodeURIComponent(KAZU_CONFIG.storeName)},%20necesito%20soporte%20o%20informaci%C3%B3n`;
    const phoneDisplay = phone.replace(/^51/, '+51 ');
    footerWaBtn.innerHTML = `<span>📲 ${phoneDisplay}</span>`;
  }

  // Selectores de Modal
  const modalBackdrop = document.getElementById('product-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBodyContent = document.getElementById('modal-body-content');

  // 3. Generador de mensajes predefinidos para WhatsApp (Psicología de Ventas)
  function generateWhatsAppUrl(product) {
    const phone = KAZU_CONFIG.whatsappNumber;
    const priceText = product.regularPrice 
      ? `S/ ${product.price.toFixed(2)} (Precio regular: S/ ${product.regularPrice.toFixed(2)})`
      : `S/ ${product.price.toFixed(2)}`;

    const messageLines = [
      `¡Hola KazuStore! Deseo activar el siguiente servicio:`,
      ``,
      `*Servicio:* ${product.name}`,
      `*Beneficio Primer Mes:* ${priceText} / ${product.periodicity}`,
      `*Tipo de Acceso:* ${product.accessType}`,
      `*Garantia:* 100% activa durante todo el periodo`,
      ``,
      `Me brindan los datos para cancelarlo por *Yape* o *Plin* y recibir mis credenciales de inmediato.`
    ];

    const encodedText = encodeURIComponent(messageLines.join('\n'));
    return `https://wa.me/${phone}?text=${encodedText}`;
  }

  // 4. Renderizado de tarjetas de catálogo
  function renderProducts() {
    let filtered = KAZU_CATALOG.filter(item => {
      // Filtro de Categoría
      if (state.selectedCategory !== 'all' && item.category !== state.selectedCategory) {
        return false;
      }
      // Filtro de Tipo de Acceso
      if (state.selectedAccess !== 'all') {
        if (state.selectedAccess === 'Hardware' && item.accessType !== 'Hardware') return false;
        if (state.selectedAccess !== 'Hardware' && !item.accessType.toLowerCase().includes(state.selectedAccess.toLowerCase())) {
          return false;
        }
      }
      // Búsqueda en tiempo real
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCategory = item.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCategory) return false;
      }
      return true;
    });

    // Ordenamiento
    if (state.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // featured
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // Actualizar Contador
    productsCounter.innerHTML = `Mostrando <strong>${filtered.length}</strong> de ${KAZU_CATALOG.length} opciones`;

    // Manejo de Estado Vacío con Sugerencias Alternativas Inteligentes
    if (filtered.length === 0) {
      productsGrid.innerHTML = '';
      emptyState.classList.remove('hidden');

      // Obtener recomendaciones alternativas (los más populares de la tienda)
      const suggestions = KAZU_CATALOG.filter(item => item.featured).slice(0, 3);
      const suggCardsHtml = suggestions.map(item => `
        <div class="sugg-alternative-card" data-detail-id="${item.id}">
          <div class="sugg-alt-icon">${item.icon}</div>
          <div class="sugg-alt-info">
            <strong>${item.name}</strong>
            <small>${item.tag} • S/ ${item.price.toFixed(2)}</small>
          </div>
          <button type="button" class="btn btn-details btn-sm" data-detail-id="${item.id}">Ver</button>
        </div>
      `).join('');

      emptyState.innerHTML = `
        <div class="empty-icon">🔍</div>
        <h3>No tenemos disponibilidad para "${state.searchQuery}"</h3>
        <p>Aún no contamos con ese servicio específico, pero <strong>mira estas opciones disponibles hoy:</strong></p>
        <div class="empty-suggestions-grid">
          ${suggCardsHtml}
        </div>
        <button class="btn btn-secondary" id="reset-filters-btn" style="margin-top: 1.25rem;">Ver Todo el Catálogo</button>
      `;

      document.getElementById('reset-filters-btn')?.addEventListener('click', resetAllFilters);
      return;
    }
    emptyState.classList.add('hidden');

    // Construcción de Tarjetas Semánticas
    const cardsHtml = filtered.map(item => {
      const waUrl = generateWhatsAppUrl(item);
      const specsListHtml = item.specs.slice(0, 3).map(s => `<li>${s}</li>`).join('');

      return `
        <article class="product-card" data-id="${item.id}">
          <div class="product-picture-block" data-brand="${item.badgeColor || item.category}">
            <div class="card-badges">
              <span class="product-tag">${item.tag}</span>
              <span class="access-badge">${item.accessType}</span>
            </div>
            <div class="product-icon-wrap" aria-hidden="true">${item.icon}</div>
          </div>

          <h3 class="product-title">${item.name}</h3>
          <p class="product-desc">${item.description}</p>

          <ul class="specs-preview-list" aria-label="Beneficios destacados">
            ${specsListHtml}
          </ul>

          <div class="card-bottom">
            <div class="price-row">
              <div>
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                  <span class="price-offer-label">${item.renewalPrice ? '1.er Mes:' : 'Oferta:'}</span>
                  ${item.regularPrice ? `<span class="price-regular-strike">S/ ${item.regularPrice.toFixed(2)}</span>` : ''}
                </div>
                <div style="display: flex; align-items: baseline; gap: 4px;">
                  <span class="price-val">S/ ${item.price.toFixed(2)}</span>
                  <span class="price-period">/${item.periodicity}</span>
                </div>
                ${item.renewalPrice ? `
                  <div class="price-renewal-hint">
                    Renovación: S/ ${item.renewalPrice.toFixed(2)} <span class="ref-pill">o S/ ${item.referralMinPrice.toFixed(2)} c/referidos</span>
                  </div>
                ` : ''}
              </div>
              <span class="stock-indicator">⚡ ${item.deliveryTime}</span>
            </div>

            <div class="card-actions-grid">
              <a 
                href="${waUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-buy-wa"
                aria-label="Pedir ${item.name} por WhatsApp a S/ ${item.price}"
              >
                <span>Pedir WhatsApp</span>
              </a>
              <button 
                type="button" 
                class="btn btn-details" 
                data-detail-id="${item.id}"
                aria-label="Ver detalles completos de ${item.name}"
              >
                Detalles
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    productsGrid.innerHTML = cardsHtml;
  }

  // 5. Gestión del Modal Accesible (A11y Lead)
  let previouslyFocusedElement = null;

  function openModal(productId) {
    const product = KAZU_CATALOG.find(p => p.id === productId);
    if (!product) return;

    previouslyFocusedElement = document.activeElement;
    state.activeModalProduct = product;
    const waUrl = generateWhatsAppUrl(product);

    const fullSpecsListHtml = product.specs.map(s => `<li>${s}</li>`).join('');

    modalBodyContent.innerHTML = `
      <div class="modal-header-info">
        <div class="modal-icon" aria-hidden="true">${product.icon}</div>
        <div>
          <div class="announcement-badges" style="margin-bottom: 0.4rem;">
            <span class="badge-mini highlight">${product.tag}</span>
            <span class="badge-mini">${product.accessType}</span>
          </div>
          <h2 class="modal-title" id="modal-product-title">${product.name}</h2>
          <small style="color: var(--text-muted);">Calificación: ⭐ ${product.rating} / 5.0 | Categoría: ${product.category.toUpperCase()}</small>
        </div>
      </div>

      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
        ${product.description}
      </p>

      <div class="modal-price-box">
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Inversión Promocional Primer Mes:</span>
          ${product.regularPrice ? `<span style="text-decoration: line-through; color: #ef4444; font-size: 0.85rem; font-weight: 600;">S/ ${product.regularPrice.toFixed(2)}</span> ` : ''}
          <span class="modal-price-val">S/ ${product.price.toFixed(2)}</span>
          <span style="color: var(--text-muted); font-size: 0.85rem;"> / ${product.periodicity}</span>
        </div>
        <div style="text-align: right;">
          <span style="display: block; font-size: 0.8rem; color: var(--accent-emerald); font-weight: 700;">● Stock: ${product.stock}</span>
          <small style="color: var(--text-faint);">Tiempo de entrega: ${product.deliveryTime}</small>
        </div>
      </div>

      ${product.renewalPrice ? `
        <div class="referral-box-notice">
          <div class="ref-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#00e676" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <strong>Transparencia Total KazuStore:</strong>
          </div>
          <p>Tu <strong>1.er mes</strong> cuesta solo <strong>S/ ${product.price.toFixed(2)}</strong>. Tu renovación habitual es de <strong>S/ ${product.renewalPrice.toFixed(2)}/mes</strong>.</p>
          <div class="ref-promo-tag">
            🎁 <strong>Club de Referidos:</strong> Por cada amigo que invites a KazuStore, recibes <strong>-S/ 1.00 de descuento</strong> en tu siguiente cuota. ¡Puedes reducir tu mensualidad hasta <strong>S/ ${product.referralMinPrice.toFixed(2)}/mes</strong>!
          </div>
        </div>
      ` : ''}

      <h3 class="modal-specs-title">Ficha Técnica & Beneficios Incluidos</h3>
      <ul class="modal-specs-list">
        ${fullSpecsListHtml}
      </ul>

      <div class="modal-actions">
        <a 
          href="${waUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn modal-btn-wa"
        >
          Comprar Ahora por WhatsApp (S/ ${product.price})
        </a>
      </div>
    `;

    modalBackdrop.classList.remove('hidden');
    modalBackdrop.removeAttribute('inert');
    modalCloseBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.add('hidden');
    modalBackdrop.setAttribute('inert', '');
    document.body.style.overflow = '';
    state.activeModalProduct = null;
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }

  // Función para restablecer todos los filtros
  function resetAllFilters() {
    state.searchQuery = '';
    state.selectedCategory = 'all';
    state.selectedAccess = 'all';
    state.sortBy = 'featured';

    if (globalSearchInput) globalSearchInput.value = '';
    if (sortSelect) sortSelect.value = 'featured';
    if (accessSelect) accessSelect.value = 'all';
    searchClearBtn?.classList.add('hidden');
    searchSuggestionsPopover?.classList.add('hidden');

    categoryButtons.forEach(b => {
      const isAll = b.getAttribute('data-category') === 'all';
      b.classList.toggle('active', isAll);
      b.setAttribute('aria-selected', isAll ? 'true' : 'false');
    });

    renderProducts();
  }

  // 7. Popover de Sugerencias Inteligentes en Tiempo Real
  const searchBoxHeader = document.getElementById('search-box-header');
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchSuggestionsPopover = document.getElementById('search-suggestions');

  function updateSearchSuggestions(query) {
    if (!searchSuggestionsPopover) return;
    const cleanQuery = query.trim().toLowerCase();

    if (cleanQuery === '') {
      searchSuggestionsPopover.classList.add('hidden');
      return;
    }

    // Coincidencias directas
    const directMatches = KAZU_CATALOG.filter(item => 
      item.name.toLowerCase().includes(cleanQuery) ||
      item.description.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery)
    );

    let html = '';

    if (directMatches.length > 0) {
      html += `
        <div class="sugg-section-title">
          <span>Servicios Encontrados (${directMatches.length})</span>
          <span>Disponible</span>
        </div>
      `;
      html += directMatches.slice(0, 5).map(item => `
        <div class="sugg-item" data-detail-id="${item.id}">
          <div class="sugg-icon">${item.icon}</div>
          <div class="sugg-info">
            <span class="sugg-name">${item.name}</span>
            <span class="sugg-desc">${item.tag} • Entrega ${item.deliveryTime}</span>
          </div>
          <span class="sugg-price">S/ ${item.price.toFixed(2)}</span>
        </div>
      `).join('');
    } else {
      // Coincidencias alternativas / recomendadas
      const recommendations = KAZU_CATALOG.filter(item => item.featured).slice(0, 3);
      html += `
        <div class="sugg-empty-notice">
          <strong>No tenemos stock para "${query}"</strong>
          <span>Aún no manejamos esa opción, pero tenemos disponible:</span>
        </div>
        <div class="sugg-section-title">
          <span>Recomendados KazuStore</span>
          <span>⚡ Entrega 3 min</span>
        </div>
      `;
      html += recommendations.map(item => `
        <div class="sugg-item" data-detail-id="${item.id}">
          <div class="sugg-icon">${item.icon}</div>
          <div class="sugg-info">
            <span class="sugg-name">${item.name}</span>
            <span class="sugg-desc">${item.tag} • ${item.accessType}</span>
          </div>
          <span class="sugg-price">S/ ${item.price.toFixed(2)}</span>
        </div>
      `).join('');
    }

    searchSuggestionsPopover.innerHTML = html;
    searchSuggestionsPopover.classList.remove('hidden');
  }

  // Eventos de Búsqueda
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      state.searchQuery = val;
      searchClearBtn?.classList.toggle('hidden', val.trim() === '');
      updateSearchSuggestions(val);
      renderProducts();
    });

    globalSearchInput.addEventListener('focus', () => {
      if (globalSearchInput.value.trim() !== '') {
        updateSearchSuggestions(globalSearchInput.value);
      }
    });
  }

  // Click en botón lupa
  searchToggleBtn?.addEventListener('click', () => {
    searchBoxHeader?.classList.toggle('expanded');
    globalSearchInput?.focus();
  });

  // Limpiar búsqueda
  searchClearBtn?.addEventListener('click', () => {
    globalSearchInput.value = '';
    state.searchQuery = '';
    searchClearBtn.classList.add('hidden');
    searchSuggestionsPopover?.classList.add('hidden');
    renderProducts();
    globalSearchInput.focus();
  });

  // Delegación de click en sugerencias para abrir modal
  searchSuggestionsPopover?.addEventListener('click', (e) => {
    const item = e.target.closest('[data-detail-id]');
    if (item) {
      const id = item.getAttribute('data-detail-id');
      searchSuggestionsPopover.classList.add('hidden');
      openModal(id);
    }
  });

  // Cerrar popover al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!searchBoxHeader?.contains(e.target)) {
      searchSuggestionsPopover?.classList.add('hidden');
    }
  });

  // Atajo de teclado para buscar ('/')
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== globalSearchInput) {
      e.preventDefault();
      searchBoxHeader?.classList.add('expanded');
      globalSearchInput?.focus();
    }
    if (e.key === 'Escape') {
      searchSuggestionsPopover?.classList.add('hidden');
      if (!modalBackdrop.classList.contains('hidden')) {
        closeModal();
      }
    }
  });

  // Filtro por pestañas de categoría
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      state.selectedCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });

  // Selector de Orden
  sortSelect?.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  // Selector de Tipo de Acceso
  accessSelect?.addEventListener('change', (e) => {
    state.selectedAccess = e.target.value;
    renderProducts();
  });

  // Delegación de eventos para Abrir Detalles (grid y sugerencias de empty state)
  document.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('[data-detail-id]');
    if (detailBtn && !e.target.closest('#search-suggestions')) {
      const id = detailBtn.getAttribute('data-detail-id');
      openModal(id);
    }
  });

  // Botón cerrar modal
  modalCloseBtn?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Restablecer Filtros
  resetFiltersBtn?.addEventListener('click', resetAllFilters);

  // 8. Conmutador de Modo Oscuro / Claro con persistencia
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('kazu_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('kazu_theme', nextTheme);
  });

  // Render inicial
  renderProducts();

  // 9. Módulo KazuPuntos: Tarjeta Digital de Sellos & Recompensas
  function initKazuPuntos() {
    const phoneInput = document.getElementById('kp-client-phone');
    const searchBtn = document.getElementById('kp-search-btn');
    const stampsGrid = document.getElementById('stamps-grid-10');
    const stampsCountEl = document.getElementById('kp-stamps-count');
    const clientTag = document.getElementById('kp-client-tag');
    const rewardStatus = document.getElementById('kp-reward-status');
    const claimBtn = document.getElementById('kp-claim-btn');

    if (!stampsGrid) return;

    function renderStamps(balance = 0, historyStamps = [], isNewWelcome = false) {
      stampsGrid.innerHTML = '';
      stampsCountEl.textContent = balance;
      const count = Math.min(10, Math.max(0, balance));

      // Mapear iconos según la festividad histórica de cada sello
      const getStampTheme = (index) => {
        if (historyStamps[index - 1]) {
          const fest = historyStamps[index - 1].festivity || historyStamps[index - 1].theme;
          if (fest === 'halloween') return { icon: '🎃', class: 'theme-halloween' };
          if (fest === 'navidad') return { icon: '🎄', class: 'theme-navidad' };
          if (fest === 'standard') return { icon: '⚡', class: 'theme-standard' };
        }
        // Fallback al tema de festividad activa de la página si fue otorgado ahora
        const currentFest = document.documentElement.getAttribute('data-festivity');
        if (currentFest === 'halloween') return { icon: '🎃', class: 'theme-halloween' };
        if (currentFest === 'navidad') return { icon: '🎄', class: 'theme-navidad' };
        return { icon: '⚡', class: 'theme-standard' };
      };

      for (let i = 1; i <= 10; i++) {
        const stamp = document.createElement('div');
        const isFilled = i <= count;
        const theme = isFilled ? getStampTheme(i) : { icon: '', class: '' };
        const isNewBonus = isNewWelcome && i === 1;

        stamp.className = `stamp-slot ${isFilled ? 'filled ' + theme.class : ''} ${i === 10 ? 'jackpot' : ''} ${isNewBonus ? 'stamp-pop-animation' : ''}`;
        stamp.innerHTML = `
          <div class="stamp-circle">
            ${isFilled ? theme.icon : `<span class="stamp-num">${i}</span>`}
          </div>
          <span class="stamp-label">${i === 5 ? 'S/ 5 OFF' : (i === 10 ? '¡MES GRATIS!' : `Sello ${i}`)}</span>
        `;
        stampsGrid.appendChild(stamp);
      }

      if (isNewWelcome) {
        rewardStatus.innerHTML = '🎁 <strong>¡BIENVENIDO A KAZUSTORE!</strong> Te regalamos tu <strong>1.er KazuPunto GRATIS</strong> por unirte a nuestro Club.';
        claimBtn.classList.add('hidden');
      } else if (balance >= 10) {
        rewardStatus.innerHTML = '🎉 <strong>¡FELICIDADES!</strong> Has completado tu tarjeta. Tienes <strong>1 Mes Gratis</strong> disponible para canjear.';
        claimBtn.classList.remove('hidden');
        claimBtn.href = `https://wa.me/${KAZU_CONFIG.whatsappNumber}?text=${encodeURIComponent(`¡Hola KazuStore! Tengo ${balance} KazuPuntos acumulados y deseo canjear mi premio de 1 MES GRATIS.`)}`;
      } else if (balance >= 5) {
        rewardStatus.innerHTML = `⭐ Tienes <strong>${balance} KazuPuntos</strong>. Ya calificas para <strong>S/ 5.00 de Descuento</strong> en tu próxima renovación o compra.`;
        claimBtn.classList.remove('hidden');
        claimBtn.href = `https://wa.me/${KAZU_CONFIG.whatsappNumber}?text=${encodeURIComponent(`¡Hola KazuStore! Tengo ${balance} KazuPuntos acumulados y deseo aplicar mi descuento de S/ 5.00 en mi compra.`)}`;
      } else {
        rewardStatus.textContent = `Acumulas 1 KazuPunto por cada compra o renovación. Te faltan ${5 - balance} para tu primer descuento.`;
        claimBtn.classList.add('hidden');
      }
    }

    async function checkClientPoints(rawPhone) {
      if (!rawPhone) return;
      const phone = rawPhone.replace(/[^\d+]/g, '');
      if (phone.length < 8) return;

      phoneInput.value = phone;
      searchBtn.disabled = true;
      searchBtn.innerHTML = '<span>Consultando...</span>';

      try {
        let client = null;
        let isNewClient = false;

        if (window.kazuDb && typeof window.kazuDb.getClientCard === 'function') {
          client = await window.kazuDb.getClientCard(phone);
        }

        // Si no está en Supabase, verificar si existe en LocalStorage offline
        if (!client) {
          const offlineLedger = JSON.parse(localStorage.getItem('kazustore_pending_stamps_v1') || '[]');
          const userStamps = offlineLedger.filter(s => s.phone && s.phone.includes(phone));
          const totalOffline = userStamps.reduce((acc, curr) => acc + (curr.amount || 0), 0);
          if (totalOffline > 0) {
            client = { stamps_balance: totalOffline, nickname: 'Cliente KazuStore', ledger: userStamps };
          }
        }

        // SI ES NUEVO (no existe registro previo), REGALAR EL 1ER SELLO AUTOMÁTICAMENTE
        if (!client) {
          isNewClient = true;
          const welcomeRes = await window.kazuDb?.claimWelcomeStamp(phone);
          const currentFest = document.documentElement.getAttribute('data-festivity') || 'standard';

          // Guardar también en LocalStorage offline por si acaso
          const offlineLedger = JSON.parse(localStorage.getItem('kazustore_pending_stamps_v1') || '[]');
          const welcomeEntry = {
            phone: phone,
            amount: 1,
            action: 'earned',
            reason: '🎁 Sello Gratis de Bienvenida KazuPuntos',
            festivity: currentFest,
            offline: true,
            id: 'welcome_' + Date.now()
          };
          offlineLedger.push(welcomeEntry);
          localStorage.setItem('kazustore_pending_stamps_v1', JSON.stringify(offlineLedger));

          client = {
            stamps_balance: 1,
            nickname: '¡Bienvenido(a) a KazuPuntos!',
            ledger: [welcomeEntry]
          };
        }

        const balance = client.stamps_balance || 0;
        clientTag.textContent = client.nickname || `WhatsApp: ${phone}`;

        // Extraer historial individual de cada sello ganado
        const historyStamps = [];
        if (client.ledger && Array.isArray(client.ledger)) {
          client.ledger.forEach(entry => {
            if (entry.action === 'earned') {
              const count = Math.max(1, entry.amount || 1);
              for (let k = 0; k < count; k++) {
                historyStamps.push({ festivity: entry.festivity || 'standard' });
              }
            }
          });
        }

        renderStamps(balance, historyStamps, isNewClient);

      } catch (e) {
        console.warn('Error al consultar KazuPuntos:', e);
        renderStamps(0);
      } finally {
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<span>Consultar Mis Puntos</span>';
      }
    }

    searchBtn?.addEventListener('click', () => {
      checkClientPoints(phoneInput.value.trim());
    });

    phoneInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkClientPoints(phoneInput.value.trim());
      }
    });

    // Detección automática por URL query: ?tel=987654321
    const urlParams = new URLSearchParams(window.location.search);
    const telParam = urlParams.get('tel') || urlParams.get('phone');
    if (telParam) {
      checkClientPoints(telParam);
      // Auto-scroll suave hacia la tarjeta
      setTimeout(() => {
        document.getElementById('kazupuntos')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      renderStamps(0);
    }
  }

  initKazuPuntos();
});

