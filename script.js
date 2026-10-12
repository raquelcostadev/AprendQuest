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
        const submitButton = resetPasswordForm.querySelector('button[type="submit"]');

        if (newPassword.length < 6) {
            alert('A nova senha precisa ter pelo menos 6 caracteres.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('As senhas não são iguais. Confira e tente novamente.');
            return;
        }

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Salvando...';
            }

            const { error } = await window.supabaseClient.auth.updateUser({
                password: newPassword
            });

            if (error) {
                console.error('Erro ao atualizar senha:', error);
                alert('Não foi possível alterar a senha. Solicite um novo link de recuperação.');
                return;
            }

            alert('Senha alterada com sucesso! Entre com sua nova senha.');

            await window.supabaseClient.auth.signOut();

            resetPasswordForm.reset();
            navigateTo('login-screen');

        } catch (error) {
            console.error('Erro inesperado ao alterar senha:', error);
            alert('Ocorreu um erro inesperado. Tente novamente.');
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

if (loginForm) {
loginForm.addEventListener('submit', async (e) => {
e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitButton = loginForm.querySelector('button[type="submit"]');

    if (!window.supabaseClient) {
        alert('Não foi possível conectar ao sistema. Atualize a página e tente novamente.');
        console.error('Cliente do Supabase não encontrado.');
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
            alert('Não foi possível entrar. Confira seu e-mail e sua senha.');
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
        alert('Ocorreu um erro inesperado. Tente novamente.');
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
        alert('Não foi possível conectar ao sistema. Atualize a página e tente novamente.');
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
            alert('Não foi possível solicitar a recuperação. Tente novamente.');
            return;
        }

        if (successMsg) {
            successMsg.style.display = 'block';
            successMsg.textContent =
                'Se esse e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.';
        }

        alert('Solicitação enviada! Confira sua caixa de entrada e a pasta de spam.');

    } catch (error) {
        console.error('Erro inesperado na recuperação:', error);
        alert('Ocorreu um erro inesperado. Tente novamente.');
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

    
// --- CADASTRO REAL COM SUPABASE ---

const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        const submitButton = registerForm.querySelector('button[type="submit"]');

        // Verifica se o Supabase foi inicializado.
        if (!window.supabaseClient) {
            alert('Não foi possível conectar ao sistema. Atualize a página e tente novamente.');
            console.error('Cliente do Supabase não encontrado.');
            return;
        }

        // Valida os campos.
        if (!name || !email || !password || !confirmPassword) {
            alert('Preencha todos os campos.');
            return;
        }

        // Confere se as senhas são iguais.
        if (password !== confirmPassword) {
            alert('As senhas não são iguais. Confira e tente novamente.');
            return;
        }

        // Evita senhas muito curtas.
        if (password.length < 6) {
            alert('A senha precisa ter pelo menos 6 caracteres.');
            return;
        }

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Criando conta...';
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
                alert('Não foi possível criar a conta. ' + error.message);
                return;
            }

            // Se a confirmação de e-mail estiver ativada,
            // o usuário precisará confirmar o endereço antes de entrar.
            if (data.user && !data.session) {
                alert(
                    'Conta criada! Confira seu e-mail e confirme o cadastro. ' +
                    'Depois, volte ao AprendQuest para entrar.'
                );

                registerForm.reset();
                navigateTo('login-screen');
                return;
            }

            if (data.user && data.session) {
                const userDisplayName =
                    document.getElementById('user-display-name');

                if (userDisplayName) {
                    userDisplayName.textContent = name;
                }

                // A pessoa autenticada pode escolher seu personagem.
                navigateTo('screen-4');
            }

        } catch (error) {
            console.error('Erro inesperado no cadastro:', error);
            alert('Ocorreu um erro inesperado. Tente novamente.');
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

        if (!selectedCard) {
            alert('Escolha um personagem antes de continuar!');
            return;
        }

        const characterName = selectedCard.dataset.char;
        const profileCircle = document.querySelector('.profile-circle');

        if (profileCircle) {
            profileCircle.textContent = selectedEmoji;
        }

        try {
            const { data: { user }, error: userError } =
                await window.supabaseClient.auth.getUser();

            if (userError || !user) {
                alert('Sua sessão não foi encontrada. Entre novamente na sua conta.');
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

                alert('Não foi possível salvar seu personagem. Tente novamente.');
                return;
            }

            navigateTo('screen-5');

        } catch (error) {
            console.error('Erro inesperado ao salvar personagem:', error);
            alert('Ocorreu um erro inesperado. Tente novamente.');
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
