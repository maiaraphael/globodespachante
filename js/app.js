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
    const paymentMethod = document.getElementById('paymentMethod');
    const installmentsGroup = document.getElementById('installmentsGroup');
    const installments = document.getElementById('installments');
    const totalValueDisplay = document.getElementById('totalValue');
    const paymentNoteDisplay = document.getElementById('paymentNote');

    if (transferType && alienationType && paymentMethod && installments) {

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
        [transferType, alienationType, paymentMethod, installments].forEach(el => {
            el.addEventListener('change', calculateTotal);
        });

        // Initial Calc
        calculateTotal();
    }
});
