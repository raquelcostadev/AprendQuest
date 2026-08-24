document.addEventListener('DOMContentLoaded', () => {

    // --- FUNÇÃO CENTRAL DE NAVEGAÇÃO ---
    function navigateTo(screenId) {
        const screens = document.querySelectorAll('.screen');
        
        screens.forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.style.display = 'flex';
            window.scrollTo(0, 0);
        }
    }

    // --- TELA 1: SPLASH ---
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            navigateTo('login-screen');
        });
    }

    // --- TELA 2: LOGIN ---
    const goToRegister = document.getElementById('go-to-register');
    if (goToRegister) {
        goToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('register-screen');
        });
    }

    const goToForgot = document.getElementById('go-to-forgot');
    if (goToForgot) {
        goToForgot.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('forgot-password-screen');
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            navigateTo('screen-4');
        });
    }

    // --- TELA RECUPERAR SENHA ---
    const goBackToLogin = document.getElementById('go-back-to-login');
    if (goBackToLogin) {
        goBackToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('login-screen');
        });
    }

    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMsg = document.getElementById('forgot-success-msg');

            if (successMsg) successMsg.style.display = 'block';

            setTimeout(() => {
                if (successMsg) successMsg.style.display = 'none';
                navigateTo('login-screen');
            }, 2000);
        });
    }

    // --- TELA 3: CADASTRO ---
    const goToLogin = document.getElementById('go-to-login');
    if (goToLogin) {
        goToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('login-screen');
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const userDisplayName = document.getElementById('user-display-name');

            if (userDisplayName && name) {
                userDisplayName.textContent = name;
            }

            navigateTo('screen-4');
        });
    }

    // --- TELA 4: SELEÇÃO DE PERSONAGEM ---
    let selectedEmoji = '🧙‍♂️'; // Emoji padrão caso o usuário mantenha a seleção inicial

    const charCards = document.querySelectorAll('.char-card');
    charCards.forEach(card => {
        card.addEventListener('click', () => {
            charCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Captura o emoji do personagem selecionado
            const emojiSpan = card.querySelector('.char-emoji');
            if (emojiSpan) {
                selectedEmoji = emojiSpan.textContent;
            }
        });
    });

    const btnConfirmChar = document.getElementById('btn-confirm-char');
    if (btnConfirmChar) {
        btnConfirmChar.addEventListener('click', () => {
            // Atualiza a foto de perfil na Tela 5 com o emoji selecionado
            const profileCircle = document.querySelector('.profile-circle');
            if (profileCircle) {
                profileCircle.textContent = selectedEmoji;
            }

            navigateTo('screen-5');
        });
    }

    // --- TELA 5: TRILHA DE APRENDIZADO ---
    const btnTrailHw = document.getElementById('btn-trail-hw');
    if (btnTrailHw) {
        btnTrailHw.addEventListener('click', () => {
            navigateTo('screen-6');
        });
    }

    // --- TELA 6: HARDWARE ---
    const btnStartQuiz = document.getElementById('btn-start-quiz');
    if (btnStartQuiz) {
        btnStartQuiz.addEventListener('click', () => {
            navigateTo('screen-5');
        });
    }

});