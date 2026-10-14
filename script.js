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

    
// --- IDENTIFICAR RECUPERAÇÃO DE SENHA ---
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
        navigateTo('reset-password-screen');
    }
});


// --- SALVAR NOVA SENHA ---

const resetPasswordForm = document.getElementById('reset-password-form');

if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('reset-password').value;
        const confirmPassword = document.getElementById('reset-confirm-password').value;
        const message = document.getElementById('reset-password-message');
        const submitButton = resetPasswordForm.querySelector('button[type="submit"]');

        function showResetMessage(text, isError = false) {
            message.textContent = text;
            message.style.display = 'block';
            message.style.color = isError ? '#dc2626' : '#16a34a';
        }

        if (newPassword.length < 6) {
            showResetMessage(
                'A nova senha precisa ter pelo menos 6 caracteres.',
                true
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            showResetMessage(
                'As senhas não são iguais. Confira e tente novamente.',
                true
            );
            return;
        }

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Salvando...';
            }

            message.style.display = 'none';

            const { error } = await window.supabaseClient.auth.updateUser({
                password: newPassword
            });

            if (error) {
                console.error('Erro ao atualizar senha:', error);

                showResetMessage(
                    'Não foi possível alterar a senha. Solicite um novo link de recuperação.',
                    true
                );
                return;
            }

            showResetMessage('Senha alterada com sucesso! Entre com sua nova senha.');

            await window.supabaseClient.auth.signOut();

            resetPasswordForm.reset();

            setTimeout(() => {
                navigateTo('login-screen');
            }, 2000);

        } catch (error) {
            console.error('Erro inesperado ao alterar senha:', error);

            showResetMessage(
                'Ocorreu um erro inesperado. Tente novamente.',
                true
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'SALVAR NOVA SENHA';
            }
        }
    });
}
// --- VOLTAR AO LOGIN PELA TELA DE NOVA SENHA ---
const resetBackToLogin = document.getElementById('reset-back-to-login');

if (resetBackToLogin) {
    resetBackToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('login-screen');
    });
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

    // --- LOGIN REAL COM SUPABASE ---
const loginForm = document.getElementById('login-form');
const loginErrorMsg = document.getElementById('login-error-msg');

function showLoginError(message) {
    if (loginErrorMsg) {
        loginErrorMsg.textContent = message;
        loginErrorMsg.style.display = 'block';
    }
}

if (loginForm) {
loginForm.addEventListener('submit', async (e) => {
e.preventDefault();
if (loginErrorMsg) {
    loginErrorMsg.textContent = '';
    loginErrorMsg.style.display = 'none';
}

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitButton = loginForm.querySelector('button[type="submit"]');

   if (!window.supabaseClient) {
    const loginErrorMsg = document.getElementById('login-error-msg');

    console.error('Cliente do Supabase não encontrado.');

    if (loginErrorMsg) {
        loginErrorMsg.textContent =
            'Não foi possível conectar ao sistema. Atualize a página e tente novamente.';
        loginErrorMsg.style.display = 'block';
    }

    return;
}

    try {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Entrando...';
        }

        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

       if (error) {
    console.error('Erro no login:', error);
    showLoginError('E-mail ou senha incorretos. Confira seus dados e tente novamente.');
    return;
}

        // Recupera o perfil da pessoa autenticada
        const { data: profile, error: profileError } =
            await window.supabaseClient
                .from('profiles')
                .select('name, character_name')
                .eq('id', data.user.id)
                .maybeSingle();

        if (profileError) {
            console.error('Erro ao recuperar perfil:', profileError);
        }

       const userDisplayName = document.getElementById('user-display-name');

if (userDisplayName && profile && profile.name) {
    userDisplayName.textContent = profile.name;
}

// Restaura o personagem salvo, se houver.
if (profile && profile.character_name) {
    const savedCharacterCard = Array.from(
        document.querySelectorAll('.char-card')
    ).find(card => card.dataset.char === profile.character_name);

    if (savedCharacterCard) {
        document.querySelectorAll('.char-card').forEach(card => {
            card.classList.remove('selected');
        });

        savedCharacterCard.classList.add('selected');

        const emojiSpan = savedCharacterCard.querySelector('.char-emoji');

        if (emojiSpan) {
            selectedEmoji = emojiSpan.textContent;
        }
    }
}

// Abre a seleção de personagem.
navigateTo('screen-4');

    } catch (error) {
        console.error('Erro inesperado no login:', error);
        showLoginError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
        }
    }
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

  // --- RECUPERAÇÃO DE SENHA COM SUPABASE ---
const forgotForm = document.getElementById('forgot-password-form');

if (forgotForm) {
forgotForm.addEventListener('submit', async (e) => {
e.preventDefault();


    const emailInput = document.getElementById('forgot-email').value.trim();
    const btnSubmit = forgotForm.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('forgot-success-msg');

   if (!window.supabaseClient) {
    showLoginError('Não foi possível conectar ao sistema. Atualize a página e tente novamente.');
    console.error('Cliente do Supabase não encontrado.');
    return;
}
    try {
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Enviando...';
        }

        const { error } = await window.supabaseClient.auth.resetPasswordForEmail(
            emailInput,
            {
                redirectTo: 'https://aprend-quest.vercel.app/'
            }
        );

                if (error) {
            console.error('Erro ao solicitar recuperação:', error);

            if (successMsg) {
                successMsg.style.display = 'block';
                successMsg.style.color = '#dc2626';
                successMsg.textContent =
                    'Não foi possível solicitar a recuperação. Tente novamente.';
            }

            return;
        }

        if (successMsg) {
            successMsg.style.display = 'block';
            successMsg.style.color = '#16a34a';
            successMsg.textContent =
                'Solicitação enviada! Se esse e-mail estiver cadastrado, você receberá as instruções. Confira também a pasta de spam.';
        }

    } catch (error) {
        console.error('Erro inesperado na recuperação:', error);

        if (successMsg) {
            successMsg.style.display = 'block';
            successMsg.style.color = '#dc2626';
            successMsg.textContent =
                'Ocorreu um erro inesperado. Tente novamente.';
        }
    } finally {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Enviar instruções';
        }
    }
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

    
// --- CADASTRO DE USUÁRIO ---

const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        const submitButton = registerForm.querySelector('button[type="submit"]');
        const message = document.getElementById('register-message');

        function showRegisterMessage(text, isError = false) {
            if (!message) return;

            message.textContent = text;
            message.style.display = 'block';
            message.style.color = isError ? '#dc2626' : '#16a34a';
        }

        if (!window.supabaseClient) {
            console.error('Cliente do Supabase não encontrado.');

            showRegisterMessage(
                'Não foi possível conectar ao sistema. Atualize a página e tente novamente.',
                true
            );
            return;
        }

        if (!name || !email || !password || !confirmPassword) {
            showRegisterMessage('Preencha todos os campos.', true);
            return;
        }

        if (password !== confirmPassword) {
            showRegisterMessage(
                'As senhas não são iguais. Confira e tente novamente.',
                true
            );
            return;
        }

        if (password.length < 6) {
            showRegisterMessage(
                'A senha precisa ter pelo menos 6 caracteres.',
                true
            );
            return;
        }

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Criando conta...';
            }

            if (message) {
                message.style.display = 'none';
            }

            const { data, error } =
                await window.supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name
                        },
                        emailRedirectTo: 'https://aprend-quest.vercel.app/'
                    }
                });

            if (error) {
                console.error('Erro no cadastro:', error);

                showRegisterMessage(
                    'Não foi possível criar a conta. ' + error.message,
                    true
                );
                return;
            }

            if (data.user && !data.session) {
                showRegisterMessage(
                    'Conta criada! Confira seu e-mail e confirme o cadastro. Depois, volte ao AprendQuest para entrar.'
                );

                registerForm.reset();
                return;
            }

            if (data.user && data.session) {
                const userDisplayName =
                    document.getElementById('user-display-name');

                if (userDisplayName) {
                    userDisplayName.textContent = name;
                }

                navigateTo('screen-4');
            }

        } catch (error) {
            console.error('Erro inesperado no cadastro:', error);

            showRegisterMessage(
                'Ocorreu um erro inesperado. Tente novamente.',
                true
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'CRIAR CONTA';
            }
        }
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

   
// --- CONFIRMAR E SALVAR PERSONAGEM ---
const btnConfirmChar = document.getElementById('btn-confirm-char');

if (btnConfirmChar) {
    btnConfirmChar.addEventListener('click', async () => {
        const selectedCard = document.querySelector('.char-card.selected');
        const message = document.getElementById('character-message');

        function showCharacterMessage(text, isError = false) {
            if (!message) return;

            message.textContent = text;
            message.style.display = 'block';
            message.style.color = isError ? '#dc2626' : '#16a34a';
        }

        if (!selectedCard) {
            showCharacterMessage(
                'Escolha um personagem antes de continuar!',
                true
            );
            return;
        }

        const characterName = selectedCard.dataset.char;
        const profileCircle = document.querySelector('.profile-circle');

        if (profileCircle) {
            profileCircle.textContent = selectedEmoji;
        }

        try {
            if (message) {
                message.style.display = 'none';
            }

            const { data: { user }, error: userError } =
                await window.supabaseClient.auth.getUser();

            if (userError || !user) {
                showCharacterMessage(
                    'Sua sessão não foi encontrada. Entre novamente na sua conta.',
                    true
                );
                return;
            }

            const { error } = await window.supabaseClient
                .from('profiles')
                .update({ character_name: characterName })
                .eq('id', user.id);

            if (error) {
                console.error('Erro ao salvar personagem:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint
                });

                showCharacterMessage(
                    'Não foi possível salvar seu personagem. Tente novamente.',
                    true
                );
                return;
            }

            navigateTo('screen-5');

        } catch (error) {
            console.error('Erro inesperado ao salvar personagem:', error);

            showCharacterMessage(
                'Ocorreu um erro inesperado. Tente novamente.',
                true
            );
        }
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

// Mostrar ou ocultar a senha na tela de login
const toggleLoginPassword = document.getElementById('toggle-login-password');
const loginPassword = document.getElementById('login-password');

if (toggleLoginPassword && loginPassword) {
    toggleLoginPassword.addEventListener('click', () => {
        const mostrarSenha = loginPassword.type === 'password';

        loginPassword.type = mostrarSenha ? 'text' : 'password';

       toggleLoginPassword.innerHTML = mostrarSenha
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
         <path d="M3 3l18 18"/>
         <path d="M10.6 10.6a2 2 0 002.8 2.8"/>
         <path d="M9.9 5.2A10.8 10.8 0 0112 5c6.4 0 10 7 10 7a15.8 15.8 0 01-4 4.8"/>
         <path d="M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a10.5 10.5 0 004.2-.9"/>
       </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
         <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/>
         <circle cx="12" cy="12" r="3"/>
       </svg>`;

        toggleLoginPassword.setAttribute(
            'aria-label',
            mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
        );

        toggleLoginPassword.setAttribute('aria-pressed', String(mostrarSenha));
    });
}
