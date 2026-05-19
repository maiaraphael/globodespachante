document.addEventListener('DOMContentLoaded', () => {

    // ── Animated stat counters ────────────────────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
        const countUp = (el) => {
            const target = +el.dataset.target;
            const duration = 1800;
            const step = target / (duration / 16);
            let current = 0;
            const tick = () => {
                current = Math.min(current + step, target);
                el.textContent = target >= 1000
                    ? Math.round(current).toLocaleString('pt-BR')
                    : Math.round(current);
                if (current < target) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };
        const statsObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(n => statsObserver.observe(n));
    }

    // ── Service card "Solicitar" links (injected) ─────────────────────────
    document.querySelectorAll('.service-card').forEach(card => {
        const serviceName = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'Serviço';
        const msg = encodeURIComponent(`Olá, entrei no site de vocês e estou entrando em contato a respeito de documentação do meu veículo. Gostaria de solicitar: ${serviceName}`);
        const link = document.createElement('a');
        link.href = `https://wa.me/554333560220?text=${msg}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'service-link';
        link.innerHTML = 'Solicitar <i class="fas fa-arrow-right"></i>';
        card.appendChild(link);
    });

    // ── FAQ accordion ─────────────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').classList.remove('open');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (unless it was already open)
            if (!isOpen) {
                item.classList.add('open');
                answer.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => observer.observe(el));

    // Smart Plate Lookup Logic
    const smartPlateInput = document.getElementById('smartPlate');
    const btnSmartConsult = document.getElementById('btnSmartConsult');

    if (smartPlateInput) {
        // Auto-format plate input
        smartPlateInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (value.length > 7) value = value.slice(0, 7);

            // Simple mask for Mercosul/Old layout visualization if needed, 
            // but for now just raw uppercase is fine or LLL-NNNN style
            // Let's do a simple formatter: LLL-NNNN or LLLNCNN

            e.target.value = value;
        });

        // Search Action
        btnSmartConsult.addEventListener('click', () => {
            const plate = smartPlateInput.value;
            if (plate.length >= 7) {
                const originalContent = btnSmartConsult.innerHTML;
                btnSmartConsult.innerHTML = '<span class="btn-text">Buscando...</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
                btnSmartConsult.style.opacity = '0.8';

                setTimeout(() => {
                    alert(`Buscando informações para a placa: ${plate}\n(Fluxo de demonstração)`);
                    btnSmartConsult.innerHTML = originalContent;
                    btnSmartConsult.style.opacity = '1';
                }, 1500);
            } else {
                smartPlateInput.focus();
                smartPlateInput.parentElement.style.animation = 'shake 0.5s';
                setTimeout(() => smartPlateInput.parentElement.style.animation = '', 500);
            }
        });
    }
    // Dropdown Menu Toggle (Hover com delay + Click)
    const dropdownItems = document.querySelectorAll('.dropdown');
    dropdownItems.forEach(dropdown => {
        let closeTimer = null;

        // Hover: abre imediatamente, fecha com delay
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(closeTimer);
            // Fecha outros dropdowns abertos por hover
            dropdownItems.forEach(d => { if (d !== dropdown) d.classList.remove('active'); });
            dropdown.classList.add('active');
        });

        dropdown.addEventListener('mouseleave', () => {
            closeTimer = setTimeout(() => {
                dropdown.classList.remove('active');
            }, 150);
        });

        // Click no link principal: previne navegação e alterna (para touch/mobile)
        const toggleLink = dropdown.querySelector(':scope > a');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        }
    });

    // Budget Calculator Logic
    const transferType = document.getElementById('transferType');
    const alienationType = document.getElementById('alienationType');
    const mercosulPlate = document.getElementById('mercosulPlate');
    const vehicleTypeGroup = document.getElementById('vehicleTypeGroup');
    const vehicleType = document.getElementById('vehicleType');
    const paymentMethod = document.getElementById('paymentMethod');
    const installmentsGroup = document.getElementById('installmentsGroup');
    const installments = document.getElementById('installments');
    const totalValueDisplay = document.getElementById('totalValue');
    const paymentNoteDisplay = document.getElementById('paymentNote');
    const clientPlateInput = document.getElementById('clientPlate');

    // Extra Service Elements
    const extraServiceSelect = document.getElementById('extraServiceSelect');
    const extraServiceDetails = document.getElementById('extraServiceDetails');
    const addExtraServiceBtn = document.getElementById('addExtraServiceBtn');

    // Discount Elements
    const discountSelect = document.getElementById('discountSelect');
    const discountDetails = document.getElementById('discountDetails');
    const discountValue = document.getElementById('discountValue');

    // Add a new extra service row dynamically
    function addExtraServiceRow() {
        const container = document.getElementById('extraServicesContainer');
        if (!container) return;
        const row = document.createElement('div');
        row.className = 'extra-service-row';
        row.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: end;';
        row.innerHTML = `
            <div class="calc-group" style="margin: 0;">
                <label>Tipo do Serviço</label>
                <input type="text" class="calc-select extra-service-desc" style="cursor: text; background-image: none;" placeholder="Ex: Taxa de Entrega">
            </div>
            <div class="calc-group" style="margin: 0;">
                <label>Valor (R$)</label>
                <input type="number" class="calc-select extra-service-value" style="cursor: text; background-image: none;" placeholder="0,00" min="0" step="0.01">
            </div>
            <button type="button" class="remove-extra-btn" style="width: 42px; height: 48px; border: none; border-radius: 8px; background: #fee2e2; color: #dc2626; cursor: pointer; font-size: 0.95rem; flex-shrink: 0;">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        row.querySelector('.remove-extra-btn').addEventListener('click', () => {
            row.remove();
            if (typeof calculateTotal === 'function') calculateTotal();
        });
        row.querySelector('.extra-service-value').addEventListener('input', () => {
            if (typeof calculateTotal === 'function') calculateTotal();
        });
        container.appendChild(row);
    }

    if (addExtraServiceBtn) {
        addExtraServiceBtn.addEventListener('click', addExtraServiceRow);
    }


    // Auto-Format Client Plate (Budget Page)
    if (clientPlateInput) {
        clientPlateInput.addEventListener('input', function (e) {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

            if (value.length > 7) value = value.slice(0, 7);

            if (value.length > 3) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            }

            e.target.value = value;
        });
    }


    // Budget Logic (Only if elements exist)
    if (transferType && alienationType && paymentMethod && installments && mercosulPlate && vehicleType) {

        // Helper to update UI based on Service Type
        function updateUI() {
            const isFirstReg = transferType.value === 'first_reg';
            const isSegundaVia = transferType.value === 'segunda_via_recibo';
            const isAlteracaoDados = transferType.value === 'alteracao_dados';
            const hideFields = isSegundaVia || isAlteracaoDados;

            // 1. Mercosul Plate & Vehicle Type
            if (isSegundaVia) {
                mercosulPlate.closest('.calc-group').style.display = 'none';
                vehicleTypeGroup.style.display = 'none';
            } else if (isFirstReg) {
                mercosulPlate.closest('.calc-group').style.display = 'none';
                vehicleTypeGroup.style.display = 'flex';
            } else if (isAlteracaoDados) {
                mercosulPlate.closest('.calc-group').style.display = 'flex';
                vehicleTypeGroup.style.display = mercosulPlate.value === 'no' ? 'flex' : 'none';
            } else {
                mercosulPlate.closest('.calc-group').style.display = 'flex';
                vehicleTypeGroup.style.display = mercosulPlate.value === 'no' ? 'flex' : 'none';
            }

            // 2. Alienation Options
            const alienationGroup = alienationType.closest('.calc-group');
            if (isSegundaVia) {
                alienationGroup.style.display = 'none';
                alienationType.value = 'none';
            } else {
                alienationGroup.style.display = 'flex';
                const options = alienationType.options;
                for (let i = 0; i < options.length; i++) {
                    if (isFirstReg) {
                        options[i].style.display = (options[i].value === 'exclude' || options[i].value === 'both') ? 'none' : 'block';
                    } else {
                        options[i].style.display = 'block';
                    }
                }
                if (isFirstReg && (alienationType.value === 'exclude' || alienationType.value === 'both')) {
                    alienationType.value = 'none';
                }
            }

            // 3. Extra Service toggle
            if (extraServiceSelect && extraServiceDetails) {
                if (extraServiceSelect.value === 'yes') {
                    extraServiceDetails.style.display = 'block';
                    const container = document.getElementById('extraServicesContainer');
                    if (container && container.children.length === 0) addExtraServiceRow();
                } else {
                    extraServiceDetails.style.display = 'none';
                }
            }

            // 4. Discount toggle
            if (discountSelect && discountDetails) {
                discountDetails.style.display = discountSelect.value === 'yes' ? 'grid' : 'none';
            }
        }


        function calculateTotal() {
            updateUI();

            let basePrice = 0;

            if (transferType.value === 'segunda_via_recibo') {
                basePrice = 390;
            } else if (transferType.value === 'alteracao_dados') {
                basePrice = 390;
                if (alienationType.value === 'include') basePrice += 60;
                else if (alienationType.value === 'exclude') basePrice += 60;
                else if (alienationType.value === 'both') basePrice += 120;

                if (mercosulPlate.value === 'no') {
                    if (vehicleType.value === 'car') basePrice += 210;
                    else if (vehicleType.value === 'moto') basePrice += 120;
                }
            } else if (transferType.value === 'first_reg') {
                if (vehicleType.value === 'car') basePrice = 720;
                else if (vehicleType.value === 'moto') basePrice = 620;
                if (alienationType.value === 'include') basePrice += 60;
            } else {
                if (transferType.value === 'pr') basePrice += 550;
                else if (transferType.value === 'other') basePrice += 670;

                if (alienationType.value === 'include') basePrice += 60;
                else if (alienationType.value === 'exclude') basePrice += 60;
                else if (alienationType.value === 'both') basePrice += 120;

                if (mercosulPlate.value === 'no') {
                    if (vehicleType.value === 'car') basePrice += 210;
                    else if (vehicleType.value === 'moto') basePrice += 120;
                }
            }

            // Sum all extra service rows
            if (extraServiceSelect && extraServiceSelect.value === 'yes') {
                document.querySelectorAll('.extra-service-value').forEach(input => {
                    basePrice += parseFloat(input.value) || 0;
                });
            }

            // Apply Discount
            if (discountSelect && discountValue && discountSelect.value === 'yes') {
                const discVal = parseFloat(discountValue.value) || 0;
                basePrice -= discVal;
                if (basePrice < 0) basePrice = 0;
            }

            let finalPrice = basePrice;
            let note = 'Pagamento à vista (Pix, Dinheiro ou Débito).';

            if (paymentMethod.value === 'credit') {
                installmentsGroup.style.display = 'flex';
                const installmentCount = parseInt(installments.value);
                const interestRate = installmentCount * 0.035;
                finalPrice = basePrice * (1 + interestRate);
                const installmentValue = finalPrice / installmentCount;
                note = `Pagamento em cartão de crédito em ${installmentCount}x de ${installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`;
            } else {
                installmentsGroup.style.display = 'none';
            }

            totalValueDisplay.textContent = finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            paymentNoteDisplay.textContent = note;
        }

        // Event Listeners
        [transferType, alienationType, mercosulPlate, vehicleType, paymentMethod, installments, extraServiceSelect, discountSelect, discountValue].forEach(el => {
            if (el) el.addEventListener('change', calculateTotal);
            if (el && el.type === 'number') el.addEventListener('input', calculateTotal);
        });

        // Initial Calc
        calculateTotal();
    }

    // FIPE Lookup Logic (Real API - Parallelum)
    const brandSelect = document.getElementById('fipeBrand');
    const modelSelect = document.getElementById('fipeModel');
    const yearSelect = document.getElementById('fipeYear');
    const btnModelConsult = document.getElementById('btnModelConsult');
    const fipeResult = document.getElementById('fipeResult');

    const API_URL = 'https://parallelum.com.br/fipe/api/v1/carros/marcas';

    if (brandSelect && fipeResult) {
        // Load Brands on Init
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                data.forEach(brand => {
                    const option = document.createElement('option');
                    option.value = brand.codigo;
                    option.textContent = brand.nome;
                    brandSelect.appendChild(option);
                });
            })
            .catch(err => console.error("Erro ao carregar marcas", err));

        // Brand Change -> Load Models
        brandSelect.addEventListener('change', () => {
            modelSelect.innerHTML = '<option value="">Carregando...</option>';
            modelSelect.disabled = true;
            yearSelect.innerHTML = '<option value="">Selecione o Ano</option>';
            yearSelect.disabled = true;
            btnModelConsult.disabled = true;

            if (!brandSelect.value) return;

            fetch(`${API_URL}/${brandSelect.value}/modelos`)
                .then(res => res.json())
                .then(data => {
                    modelSelect.innerHTML = '<option value="">Selecione o Modelo</option>';
                    data.modelos.forEach(model => {
                        const option = document.createElement('option');
                        option.value = model.codigo;
                        option.textContent = model.nome;
                        modelSelect.appendChild(option);
                    });
                    modelSelect.disabled = false;
                });
        });

        // Model Change -> Load Years
        modelSelect.addEventListener('change', () => {
            yearSelect.innerHTML = '<option value="">Carregando...</option>';
            yearSelect.disabled = true;
            btnModelConsult.disabled = true;

            if (!modelSelect.value) return;

            fetch(`${API_URL}/${brandSelect.value}/modelos/${modelSelect.value}/anos`)
                .then(res => res.json())
                .then(data => {
                    yearSelect.innerHTML = '<option value="">Selecione o Ano</option>';
                    data.forEach(year => {
                        const option = document.createElement('option');
                        option.value = year.codigo;
                        option.textContent = year.nome;
                        yearSelect.appendChild(option);
                    });
                    yearSelect.disabled = false;
                });
        });

        // Year Change -> Enable Button
        yearSelect.addEventListener('change', () => {
            btnModelConsult.disabled = !yearSelect.value;
        });

        // Consult Click -> specific fetch
        btnModelConsult.addEventListener('click', () => {
            const originalBtnContent = btnModelConsult.innerHTML;
            btnModelConsult.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
            btnModelConsult.disabled = true;
            fipeResult.style.display = 'none';

            fetch(`${API_URL}/${brandSelect.value}/modelos/${modelSelect.value}/anos/${yearSelect.value}`)
                .then(res => res.json())
                .then(data => {
                    const resultData = {
                        model: data.Modelo,
                        year: data.AnoModelo,
                        price: data.Valor,
                        fipeCode: data.CodigoFipe,
                        refMonth: data.MesReferencia,
                        city: 'Brasil (Média Nacional)', // Default for table
                        type: 'car'
                    };
                    displayFipeResult(resultData);

                    // Remove Disclaimer if exists (Real Data doesn't need it)
                    const existingDisclaimer = document.getElementById('sim-disclaimer');
                    if (existingDisclaimer) existingDisclaimer.remove();

                    btnModelConsult.innerHTML = originalBtnContent;
                    btnModelConsult.disabled = false;
                })
                .catch(err => {
                    alert('Erro ao buscar dados. Tente novamente.');
                    btnModelConsult.innerHTML = originalBtnContent;
                    btnModelConsult.disabled = false;
                });
        });
    }

    function displayFipeResult(data) {
        document.getElementById('resModel').textContent = data.model;
        document.getElementById('resYear').textContent = data.year;
        document.getElementById('resPrice').textContent = data.price;
        document.getElementById('resFipeCode').textContent = data.fipeCode;
        document.getElementById('resRefMonth').textContent = data.refMonth;
        document.getElementById('resCity').textContent = data.city;

        const iconContainer = document.querySelector('.vehicle-icon-circle');
        iconContainer.innerHTML = '<i class="fas fa-car"></i>'; // Default to car

        fipeResult.style.display = 'block';
        fipeResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ... (Existing code) Use DOMContentLoaded to ensure body exists

    // -------------------------------------------------------
    // NEW: Auto-Uppercase & CPF Mask & FAB Injection
    // -------------------------------------------------------

    // 1. Auto-Uppercase for all text inputs
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', function () {
            // Store cursor position to prevent jumping
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.toUpperCase();
            this.setSelectionRange(start, end);
        });
    });

    // 2. CPF Mask Logic
    const cpfInputs = document.querySelectorAll('.mask-cpf');
    cpfInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            // Apply Mask 000.000.000-00
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

            e.target.value = value;
        });
    });

    // 2b. CPF/CNPJ Dual Mask Logic
    const cpfCnpjInputs = document.querySelectorAll('.mask-cpf-cnpj');
    cpfCnpjInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 14) value = value.slice(0, 14);

            if (value.length <= 11) {
                // CPF Mask: 000.000.000-00
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else {
                // CNPJ Mask: 00.000.000/0000-00
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }

            e.target.value = value;
        });
    });

    // 3. Inject Floating Buttons (WhatsApp & Print)
    const fabContainer = document.createElement('div');
    fabContainer.className = 'fab-container';

    // 5. Print Logic (Handles both Button and Ctrl+P)
    function updatePrintQuote() {
        const quoteContainer = document.querySelector('.printable-quote');
        // Only run if we are on a page with the printable quote
        if (!quoteContainer) return;

        // 1. Capture Client Data
        const pName = document.getElementById('clientName').value || 'Não informado';
        const pPlate = document.getElementById('clientPlate').value || '---';
        const pModel = document.getElementById('clientModel').value || '---';

        const quoteClientName = document.getElementById('quoteClientName');
        const quotePlate = document.getElementById('quotePlate');
        const quoteModel = document.getElementById('quoteModel');

        if (quoteClientName) quoteClientName.textContent = pName;
        if (quotePlate) quotePlate.textContent = pPlate.toUpperCase();
        if (quoteModel) quoteModel.textContent = pModel;

        // 2. Capture Date
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const quoteDate = document.getElementById('quoteDate');
        if (quoteDate) quoteDate.textContent = now.toLocaleDateString('pt-BR', options);

        // 3. Build Itemized List based on selections
        const itemsList = document.getElementById('quoteItemsList');
        if (itemsList) {
            itemsList.innerHTML = ''; // Clear previous

            const transferType = document.getElementById('transferType');
            const alienationType = document.getElementById('alienationType');
            const mercosulPlate = document.getElementById('mercosulPlate');
            const vehicleType = document.getElementById('vehicleType');
            const totalValueDisplay = document.getElementById('totalValue');
            const paymentNoteDisplay = document.getElementById('paymentNote');

            // Helper to add row
            const addRow = (desc, price) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${desc}</td><td class="amount">${price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>`;
                itemsList.appendChild(tr);
            };

            // Service Type Cost
            if (transferType) {
                if (transferType.value === 'pr') addRow('Transferência de Veículo (PR)', 550);
                else if (transferType.value === 'other') addRow('Transferência de Veículo (Outro Estado)', 670);
                else if (transferType.value === 'segunda_via_recibo') addRow('Emissão de Segunda Via do Recibo', 390);
                else if (transferType.value === 'alteracao_dados') addRow('Alteração de Dados', 390);
                else if (transferType.value === 'first_reg') {
                    const label = vehicleType.value === 'car' ? 'Primeiro Emplacamento (Automóvel)' : 'Primeiro Emplacamento (Moto)';
                    const price = vehicleType.value === 'car' ? 720 : 620;
                    addRow(label, price);
                }
            }

            // Alienation Cost
            if (alienationType && alienationType.value !== 'none') {
                if (alienationType.value === 'include') addRow('Inclusão de Gravame', 60);
                else if (alienationType.value === 'exclude') addRow('Exclusão de Gravame', 60);
                else if (alienationType.value === 'both') {
                    addRow('Inclusão de Gravame', 60);
                    addRow('Exclusão de Gravame', 60);
                }
            }

            // Plate Cost
            if (mercosulPlate && mercosulPlate.value === 'no') {
                if (vehicleType && vehicleType.value === 'car') addRow('Par de Placas Mercosul (Carro)', 210);
                else if (vehicleType && vehicleType.value === 'moto') addRow('Placa Mercosul (Moto)', 120);
            }

            // Extra Service Cost (multiple rows)
            const extraServiceSelect = document.getElementById('extraServiceSelect');
            if (extraServiceSelect && extraServiceSelect.value === 'yes') {
                document.querySelectorAll('.extra-service-row').forEach(row => {
                    const desc = row.querySelector('.extra-service-desc')?.value || 'Serviço Extra';
                    const val = parseFloat(row.querySelector('.extra-service-value')?.value) || 0;
                    if (val > 0) addRow(desc, val);
                });
            }

            // Discount Row
            // Need to re-fetch element inside this scope if not available, or use global IDs
            const discountSelect = document.getElementById('discountSelect');
            const discountValue = document.getElementById('discountValue');

            if (discountSelect && discountSelect.value === 'yes') {
                const dVal = (discountValue ? parseFloat(discountValue.value) : 0) || 0;
                if (dVal > 0) {
                    // Show as negative
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>Desconto Aplicado</td><td class="amount" style="color: #d32f2f;">- ${dVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>`;
                    itemsList.appendChild(tr);
                }
            }
        }


        // 4. Update Total and Note
        if (totalValueDisplay) document.getElementById('quoteTotalValue').textContent = totalValueDisplay.textContent;
        if (paymentNoteDisplay) document.getElementById('quotePaymentNote').textContent = paymentNoteDisplay.textContent;
    }

    // Bind to browser print event
    window.addEventListener('beforeprint', updatePrintQuote);

    // Print Button (Only on form pages - check by existing of .page or .page-container)
    // ALSO for the Budget page (orcamento.html) which now has .printable-quote
    if (document.querySelector('.page') || document.querySelector('.page-container') || document.querySelector('.printable-quote')) {
        const printBtn = document.createElement('button');
        printBtn.className = 'fab-btn fab-print';
        printBtn.innerHTML = '<i class="fas fa-print"></i>';
        printBtn.setAttribute('data-tooltip', 'Imprimir Formulário/Orçamento');

        printBtn.onclick = () => {
            // Forcing update manually too, just in case
            updatePrintQuote();
            window.print();
        };
        fabContainer.appendChild(printBtn);
    }

    // WhatsApp Button (All pages)
    const waBtn = document.createElement('a');
    waBtn.className = 'fab-btn fab-whatsapp';
    waBtn.href = 'https://wa.me/554333560220?text=Ol%C3%A1%2C%20entrei%20no%20site%20de%20voc%C3%AAs%20e%20estou%20entrando%20em%20contato%20a%20respeito%20de%20documenta%C3%A7%C3%A3o%20do%20meu%20ve%C3%ADculo.';
    waBtn.target = '_blank';
    waBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    waBtn.setAttribute('data-tooltip', 'Falar no WhatsApp');
    fabContainer.appendChild(waBtn);

    // 4. Auto-Dash Fill Logic
    function applyAutoDash(input) {
        if (!input.classList.contains('auto-dash')) return;

        const style = window.getComputedStyle(input);
        const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const maxWidth = input.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

        // Create a canvas to measure text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;

        let text = input.value.replace(/ -+$/, '').trim(); // Remove existing dashes

        // If empty, clean it up but usually we might want full dashes? 
        // User asked: "após eu digitar o dado... preenchesse o restante"
        // Let's assume if empty, we leave it empty? Or maybe full dashes?
        // Let's stick to "fill remaining space". If empty, remaining space is all of it.

        let currentWidth = context.measureText(text).width;
        let dashWidth = context.measureText('-').width;

        let dashes = '';
        // Add a small buffer to avoid overflow
        const buffer = 10;

        if (text.length > 0) {
            text += ' '; // Add space after text
            currentWidth += context.measureText(' ').width;
        }

        while ((currentWidth + dashWidth) < (maxWidth - buffer)) {
            dashes += '-';
            currentWidth += dashWidth;
        }

        input.value = text + dashes;
    }

    document.querySelectorAll('.auto-dash').forEach(input => {
        input.addEventListener('blur', () => applyAutoDash(input));
        input.addEventListener('focus', () => {
            // Remove space + dashes at the end
            input.value = input.value.replace(/ -+$/, '');
            // Remove dashes if it's ONLY dashes (full fill)
            if (/^-+$/.test(input.value)) input.value = '';
        });
        // Apply initially if value exists?
        // applyAutoDash(input); 
    });

    // -------------------------------------------------------
    // NEW: Dynamic Outorgados (Procuracao Simples)
    // -------------------------------------------------------
    const outorgadosContainer = document.getElementById('outorgados-container');
    const outorgadosTitle = document.getElementById('outorgados-title');
    const outorgadosFields = document.getElementById('outorgados-fields');
    const radioOutorgados = document.querySelectorAll('input[name="num_outorgados"]');

    if (outorgadosContainer && outorgadosTitle && outorgadosFields && radioOutorgados.length > 0) {

        const template = (index, total) => `
            <div class="outorgado-block" style="${index > 1 ? 'margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 20px;' : ''}">
                <div class="form-row">
                    <div class="field" style="flex: 3;">
                        <label>Nome</label>
                        <input type="text" placeholder="">
                    </div>
                    <div class="field" style="flex: 1;">
                        <label>CPF/CNPJ</label>
                        <input type="text" placeholder="" class="mask-cpf-cnpj">
                    </div>
                </div>
                <div class="form-row">
                    <div class="field">
                        <label>Endereço</label>
                        <input type="text" placeholder="">
                    </div>
                </div>
            </div>
        `;

        function updateOutorgados(count) {
            // Update Title
            outorgadosTitle.textContent = count > 1 ? 'OUTORGADOS' : 'OUTORGADO';

            // Clear Fields
            outorgadosFields.innerHTML = '';

            // Generate Fields
            for (let i = 1; i <= count; i++) {
                outorgadosFields.insertAdjacentHTML('beforeend', template(i, count));
            }

            // Re-apply listeners for new inputs
            // Auto Uppercase
            outorgadosFields.querySelectorAll('input[type="text"]').forEach(input => {
                input.addEventListener('input', function () {
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    this.value = this.value.toUpperCase();
                    this.setSelectionRange(start, end);
                });
            });
            // CPF/CNPJ Mask (Dual)
            outorgadosFields.querySelectorAll('.mask-cpf-cnpj').forEach(input => {
                input.addEventListener('input', function (e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 14) value = value.slice(0, 14);

                    if (value.length <= 11) {
                        // CPF Mask
                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    } else {
                        // CNPJ Mask
                        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                        value = value.replace(/(\d{4})(\d)/, '$1-$2');
                    }
                    e.target.value = value;
                });
            });
        }

        radioOutorgados.forEach(radio => {
            radio.addEventListener('change', (e) => {
                updateOutorgados(parseInt(e.target.value));
            });
        });
    }

    document.body.appendChild(fabContainer);
});

/* ============================================================
   TRANSFER JOURNEY — Sticky-Scroll Cinematic Animation
   ============================================================ */
(function initTransferJourney() {
    'use strict';

    const section = document.getElementById('transfer-journey');
    if (!section) return;

    const bg       = document.getElementById('tjBg');
    const orb2     = document.getElementById('tjOrb2');
    const intro    = document.getElementById('tjIntro');
    const fill     = document.getElementById('tjProgressFill');
    const dots     = Array.from(section.querySelectorAll('.tj-dot'));
    const steps    = Array.from(section.querySelectorAll('.tj-step'));

    const STEP_COUNT  = steps.length; // 5
    const INTRO_END   = 0.13;         // first 13% = intro phase
    const STEP_SPAN   = (1 - INTRO_END) / STEP_COUNT;

    // Background configs per phase (0=intro, 1-5=steps)
    const BG = [
        { bg: 'radial-gradient(ellipse 80% 80% at 70% 28%, #001845 0%, #020810 100%)', orb: 'rgba(0,39,118,.22)' },
        { bg: 'radial-gradient(ellipse 80% 80% at 75% 62%, #002a14 0%, #020810 100%)', orb: 'rgba(0,156,59,.22)' },
        { bg: 'radial-gradient(ellipse 80% 80% at 24% 40%, #001428 0%, #020810 100%)', orb: 'rgba(0,66,176,.22)' },
        { bg: 'radial-gradient(ellipse 80% 80% at 65% 68%, #1a0d00 0%, #020810 100%)', orb: 'rgba(180,100,0,.22)'  },
        { bg: 'radial-gradient(ellipse 80% 80% at 35% 32%, #000e1f 0%, #020810 100%)', orb: 'rgba(0,39,118,.22)'  },
        { bg: 'radial-gradient(ellipse 80% 80% at 50% 50%, #003318 0%, #020810 100%)', orb: 'rgba(0,200,83,.30)'  },
    ];

    let lastPhaseIdx = -1;
    let rafId = null;

    function getProgress() {
        const rect     = section.getBoundingClientRect();
        const scrolled = -rect.top;
        const maxScroll = section.offsetHeight - window.innerHeight;
        return Math.max(0, Math.min(1, scrolled / maxScroll));
    }

    function isMobile() { return window.innerWidth <= 900; }

    function update() {
        if (isMobile()) return;

        const p = getProgress();

        /* ── Determine active phase ── */
        let phaseIdx, phaseLocal;
        if (p <= INTRO_END) {
            phaseIdx   = 0;
            phaseLocal = p / INTRO_END;
        } else {
            const rel   = (p - INTRO_END) / (1 - INTRO_END);
            phaseIdx    = Math.min(1 + Math.floor(rel * STEP_COUNT), STEP_COUNT);
            phaseLocal  = (rel * STEP_COUNT) % 1;
        }

        /* ── Intro opacity / transform ── */
        if (phaseIdx === 0) {
            const t = Math.max(0, (phaseLocal - 0.45) / 0.55);
            intro.style.opacity   = String(Math.max(0, 1 - t * 2.2));
            intro.style.transform = t > 0 ? `translateY(${-t * 44}px) scale(${1 - t * .03})` : 'none';
        } else {
            intro.style.opacity   = '0';
            intro.style.transform = 'translateY(-44px) scale(0.97)';
        }

        /* ── Steps ── */
        steps.forEach((step, i) => {
            const stepPhase = i + 1;
            step.classList.remove('tj-active', 'tj-exit');
            if (phaseIdx === stepPhase) {
                step.classList.add('tj-active');
            } else if (phaseIdx > stepPhase) {
                step.classList.add('tj-exit');
            }
            // else: default state = entering from right (translateX(70px))
        });

        /* ── Progress bar ── */
        const stepPct = Math.max(0, (p - INTRO_END) / (1 - INTRO_END));
        fill.style.height = (Math.min(stepPct, 1) * 100) + '%';

        /* ── Sidebar dots ── */
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', phaseIdx === i + 1);
            dot.classList.toggle('done',   phaseIdx >  i + 1);
        });

        /* ── Background & orb ── (throttled to phase changes) ── */
        if (phaseIdx !== lastPhaseIdx) {
            const cfg = BG[phaseIdx] || BG[0];
            if (bg)   bg.style.background   = cfg.bg;
            if (orb2) orb2.style.background = cfg.orb;
            lastPhaseIdx = phaseIdx;
        }
    }

    function onScroll() {
        if (rafId) return;
        rafId = requestAnimationFrame(() => { update(); rafId = null; });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update(); // set initial state

    /* ── Mobile: IntersectionObserver fallback ── */
    if (isMobile()) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('tj-mobile-visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.22 });
        steps.forEach(s => obs.observe(s));
    }
}());
