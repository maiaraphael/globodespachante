document.addEventListener('DOMContentLoaded', () => {

    // Ensure Firebase is loaded
    if (!firebase || !firebase.auth) {
        console.error("Firebase SDK not loaded!");
        return;
    }

    const auth = firebase.auth();

    // Attempt to force LOCAL persistence to help with browser quirks
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .catch((error) => {
            console.error("Erro ao definir persistência:", error);
        });

    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const protectedMenu = document.getElementById('protectedMenu');
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const authForm = document.getElementById('authForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const authError = document.getElementById('authError');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const modalTitle = document.getElementById('modalTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');

    let isLoginMode = true;

    // --- Event Listeners ---

    // Open Modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.classList.add('active');
            authError.style.display = 'none';
        });
    }

    // Close Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            authModal.classList.remove('active');
        });
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });

    // Toggle Login/Register
    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            if (isLoginMode) {
                modalTitle.textContent = 'Login';
                authSubmitBtn.textContent = 'Entrar';
                toggleAuthMode.innerHTML = 'Não tem conta? <b>Cadastre-se</b>';
            } else {
                modalTitle.textContent = 'Nova Conta';
                authSubmitBtn.textContent = 'Cadastrar';
                toggleAuthMode.innerHTML = 'Já tem conta? <b>Faça Login</b>';
            }
            authError.style.display = 'none';
        });
    }

    // Submit Form
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            authError.style.display = 'none';
            authSubmitBtn.disabled = true;
            authSubmitBtn.textContent = 'Processando...';

            if (isLoginMode) {
                // Login
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Signed in
                        authModal.classList.remove('active');
                        authForm.reset();
                    })
                    .catch((error) => {
                        authError.textContent = "Erro no login: " + translateError(error.code);
                        authError.style.display = 'block';
                    })
                    .finally(() => {
                        authSubmitBtn.disabled = false;
                        authSubmitBtn.textContent = 'Entrar';
                    });
            } else {
                // Register
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Signed up
                        authModal.classList.remove('active');
                        authForm.reset();
                        alert("Conta criada com sucesso!");
                    })
                    .catch((error) => {
                        authError.textContent = "Erro no cadastro: " + translateError(error.code);
                        authError.style.display = 'block';
                    })
                    .finally(() => {
                        authSubmitBtn.disabled = false;
                        authSubmitBtn.textContent = 'Cadastrar';
                    });
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                // Sign-out successful.
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error('Logout error', error);
            });
        });
    }

    // --- Auth State Monitor ---
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log("Usuário logado:", user.email);
            if (protectedMenu) protectedMenu.classList.remove('hidden');
            if (loginBtn) loginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
        } else {
            // User is signed out
            console.log("Usuário deslogado");
            if (protectedMenu) protectedMenu.classList.add('hidden');
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
        }
    });

    // Helper: Translate Firebase Errors to Portuguese
    function translateError(code) {
        switch (code) {
            case 'auth/invalid-email': return 'E-mail inválido.';
            case 'auth/user-disabled': return 'Este usuário foi desativado.';
            case 'auth/user-not-found': return 'Usuário não encontrado.';
            case 'auth/wrong-password': return 'Senha incorreta.';
            case 'auth/email-already-in-use': return 'Este e-mail já está em uso.';
            case 'auth/weak-password': return 'A senha é muito fraca (mínimo 6 caracteres).';
            default: return 'Erro desconhecido (' + code + ')';
        }
    }

    // --- Route Protection ---
    const protectedPages = [
        'requerimento_atpv.html',
        'procuracao_simples.html',
        'declaracao_residencia.html',
        'cancelamento_comunicado.html',
        'segunda_via_crv.html'
    ];

    const path = window.location.pathname;
    const pageObj = path.split("/").pop();
    const currentPage = pageObj || 'index.html'; // Default to index.html if empty path

    if (protectedPages.includes(currentPage)) {
        // Authenticated State Handler
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, reveal page
                document.body.classList.remove('auth-loading');
            } else {
                // No user, redirect to index
                console.log("Acesso negado. Redirecionando para login.");
                window.location.href = 'index.html';
                // Note: body remains hidden (auth-loading) during redirect
            }
        });
    }
});
