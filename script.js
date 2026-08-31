document.addEventListener('DOMContentLoaded', () => {

    // 1. Inicializa o EmailJS de forma segura
    if (typeof emailjs !== 'undefined') {
        emailjs.init("fiYCKP3cc1XpNwD0H");
    }

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

    // --- VERIFICAÇÃO DE PARÂMETROS DE URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const screenParam = urlParams.get('screen');

    if (screenParam) {
        navigateTo(screenParam);
    }

    // --- BOTÃO DE VOLTAR PARA A TELA INICIAL (SPLASH/LOGIN) ---
    const btnResetHome = document.getElementById('btn-back-to-home');
    if (btnResetHome) {
        btnResetHome.addEventListener('click', () => {
            // Limpa parâmetros da URL e redireciona para o início
            window.location.href = 'index.html'; 
        });
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

    // ENVIO DE E-MAIL COM EMAILJS INTEGRADO
    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('forgot-email').value;
            const btnSubmit = forgotForm.querySelector('button[type="submit"]');
            const successMsg = document.getElementById('forgot-success-msg');

            btnSubmit.disabled = true;
            btnSubmit.innerText = "Enviando...";

            const templateParams = {
                email: emailInput,
                to_email: emailInput,
                user_email: emailInput,
                link: "https://seu-site.vercel.app/redefinir-senha.html"
            };

            emailjs.send("service_m8pn1zb", "template_qmlgjr6", templateParams)
                .then(() => {
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        successMsg.innerHTML = `✉️ Instruções enviadas para <strong>${emailInput}</strong>! Redirecionando...`;
                    }

                    btnSubmit.innerText = "Enviado! ✨";

                    setTimeout(() => {
                        if (successMsg) successMsg.style.display = 'none';
                        btnSubmit.disabled = false;
                        btnSubmit.innerText = "Enviar Instruções";
                        navigateTo('login-screen');
                    }, 3000);
                })
                .catch((error) => {
                    console.error("Erro no EmailJS:", error);
                    alert("Erro ao enviar o e-mail. Verifique no console os detalhes ou a conta vinculada no EmailJS.");
                    btnSubmit.disabled = false;
                    btnSubmit.innerText = "Enviar Instruções";
                });
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
    let selectedEmoji = '🧙‍♂️';

    const charCards = document.querySelectorAll('.char-card');
    charCards.forEach(card => {
        card.addEventListener('click', () => {
            charCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const emojiSpan = card.querySelector('.char-emoji');
            if (emojiSpan) {
                selectedEmoji = emojiSpan.textContent;
            }
        });
    });

    const btnConfirmChar = document.getElementById('btn-confirm-char');
    if (btnConfirmChar) {
        btnConfirmChar.addEventListener('click', () => {
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

    const btnTrailProg = document.getElementById('btn-trail-prog');
    if (btnTrailProg) {
        btnTrailProg.addEventListener('click', () => {
            window.location.href = 'Quiz_programação.html';
        });
    }

    const btnDesafios = document.getElementById('btn-trail-quiz');
    if (btnDesafios) {
        btnDesafios.addEventListener('click', () => {
            window.location.href = 'Desafio_final.html';
        });
    }

    // --- TELA 6: HARDWARE ---
    const btnStartQuiz = document.getElementById('btn-start-quiz');
    if (btnStartQuiz) {
        btnStartQuiz.addEventListener('click', () => {
            window.location.href = 'Quiz_hardware.html';
        });
    }
  
    const btnOrganization = document.getElementById('btn-go-organization');
if (btnOrganization) {
    btnOrganization.addEventListener('click', () => {
        window.location.href = 'organizacao.html';
    });
}

// Lista de Missões Diárias para variação
const dailyMissions = [
    {
        title: "Introdução à Lógica",
        desc: "Aprenda a organizar ideias e resolver desafios divertidos!",
        link: "organizacao.html"
    },
    {
        title: "Respirar & Focar",
        desc: "Treine sua mente para manter a calma e a atenção total!",
        link: "organizacao.html"
    },
    {
        title: "Desafio dos Objetos",
        desc: "Encontre os objetos ao seu redor e pratique a presença!",
        link: "organizacao.html"
    }
];

let currentMissionIndex = 0;

function startDailyMission() {
    if (typeof safePlaySound === 'function') safePlaySound('click');
    const mission = dailyMissions[currentMissionIndex];
    window.location.href = mission.link;
}

function shuffleMission() {
    if (typeof safePlaySound === 'function') safePlaySound('click');
    currentMissionIndex = (currentMissionIndex + 1) % dailyMissions.length;
    
    const titleEl = document.getElementById('daily-mission-title');
    const descEl = document.getElementById('daily-mission-desc');
    
    if (titleEl && descEl) {
        titleEl.innerText = dailyMissions[currentMissionIndex].title;
        descEl.innerText = dailyMissions[currentMissionIndex].desc;
    }
}

// Função do Botão Principal "Começar Agora"
function startFullTrail() {
    if (typeof safePlaySound === 'function') safePlaySound('click');
    
    // Salva o estado de que o aluno está fazendo a Trilha Guiada Sequencial
    localStorage.setItem('trilhaModo', 'guiada');
    
    // Redireciona para o 1º módulo (Programação)
    window.location.href = 'programacao.html';
}

// Lista de variações de texto para o botão de dado 🎲
const highlightMissions = [
    {
        title: "Jornada de Aprendizado",
        desc: "Comece do zero e passe por Programação, Hardware e Gestão Emocional!"
    },
    {
        title: "Módulo 1: Programação",
        desc: "Aprenda lógica de programação com blocos e comandos divertidos!"
    },
    {
        title: "Módulo 2: Hardware",
        desc: "Descubra como o computador funciona por dentro!"
    },
    {
        title: "Módulo 3: Gestão Emocional",
        desc: "Aprenda a focar, controlar a ansiedade e organizar suas ideias!"
    }
];

let highlightIndex = 0;

function shuffleMission() {
    if (typeof safePlaySound === 'function') safePlaySound('click');
    highlightIndex = (highlightIndex + 1) % highlightMissions.length;
    
    const titleEl = document.getElementById('daily-mission-title');
    const descEl = document.getElementById('daily-mission-desc');
    
    if (titleEl && descEl) {
        titleEl.innerText = highlightMissions[highlightIndex].title;
        descEl.innerText = highlightMissions[highlightIndex].desc;
    }
}

});
