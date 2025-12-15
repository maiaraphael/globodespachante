document.addEventListener('DOMContentLoaded', () => {
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
    // Dropdown Menu Toggle (Click)
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdownToggle => {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = dropdownToggle.parentElement;
            parent.classList.toggle('active');
        });
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

    if (transferType && alienationType && paymentMethod && installments && mercosulPlate && vehicleType) {

        function calculateTotal() {
            // Base Prices
            let basePrice = 0;

            // Transfer Type
            if (transferType.value === 'pr') basePrice += 530;
            else if (transferType.value === 'other') basePrice += 640;

            // Alienation
            if (alienationType.value === 'include') basePrice += 60;
            else if (alienationType.value === 'exclude') basePrice += 60;
            else if (alienationType.value === 'both') basePrice += 120;

            // Placa Mercosul Logic
            if (mercosulPlate.value === 'no') {
                vehicleTypeGroup.style.display = 'flex';
                if (vehicleType.value === 'car') basePrice += 210;
                else if (vehicleType.value === 'moto') basePrice += 120;
            } else {
                vehicleTypeGroup.style.display = 'none';
            }

            let finalPrice = basePrice;
            let note = "Pagamento à vista (Pix, Dinheiro ou Débito).";

            // Payment Method Logic
            if (paymentMethod.value === 'credit') {
                installmentsGroup.style.display = 'flex';
                const installmentCount = parseInt(installments.value);

                // Interest Calculation: Each installment adds 3.5% to the total
                // Logic: 1x = 3.5%, 2x = 7%, 10x = 35%...
                const interestRate = installmentCount * 0.035;
                finalPrice = basePrice * (1 + interestRate);

                const installmentValue = finalPrice / installmentCount;
                note = `Pagamento em cartão de crédito em ${installmentCount}x de ${installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`;
            } else {
                installmentsGroup.style.display = 'none';
            }

            // Update Display
            totalValueDisplay.textContent = finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            paymentNoteDisplay.textContent = note;
        }

        // Add Event Listeners
        [transferType, alienationType, mercosulPlate, vehicleType, paymentMethod, installments].forEach(el => {
            el.addEventListener('change', calculateTotal);
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

});
