// Banco com 3 situações do cotidiano para a Missão 2

const emotionQuestions = [
{
id: 1,
text: "Você está jogando ou fazendo uma atividade de que gosta, mas ela para de funcionar de repente. Como você acha que se sentiria?"
},
{
id: 2,
text: "Você tenta resolver um desafio, tenta de novo e ainda não consegue. O que poderia sentir nessa situação?"
},
{
id: 3,
text: "Você estava animado para fazer uma coisa, mas seus planos mudaram de repente. Como imagina que se sentiria?"
}
];


let currentQuestionIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
    const supabaseClient = window.supabaseClient;
    const pxElement = document.getElementById('user-px');
    const levelElement = document.getElementById('user-level');

    if (!supabaseClient) {
        console.error('Cliente Supabase não encontrado.');
        return;
    }

    const { data: { user }, error: authError } =
        await supabaseClient.auth.getUser();

    if (authError || !user) {
        console.error('Não foi possível identificar o usuário:', authError);
        return;
    }

    const { data, error } = await supabaseClient
        .from('user_progress')
        .select('total_xp')
        .eq('user_id', user.id)
        .maybeSingle();

    if (error) {
        console.error('Erro ao consultar os PX:', error);
        return;
    }

    const pxAtual = data ? Number(data.total_xp) : 0;
    const nivelAtual = Math.floor(pxAtual / 100) + 1;

    localStorage.setItem('userPX', pxAtual);

    if (pxElement) {
        pxElement.innerText = `⚡ ${pxAtual} PX`;
    }

    if (levelElement) {
        levelElement.innerText = `Nível ${nivelAtual}`;
    }

    loadEmotionQuestion();
});



// Função auxiliar de segurança para os sons
function safePlaySound(soundName) {
    if (typeof playSound === 'function') {
        playSound(soundName);
    }
}

// 1. Check-in Emocional
function selectMood(mood, event) {
    safePlaySound('click');
    const buttons = document.querySelectorAll('.mood-btn');
    buttons.forEach(btn => btn.classList.remove('bounce'));

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('bounce');
    }

    const feedback = document.getElementById('mood-feedback');
    if (feedback) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = '#e0f2fe';
        feedback.style.color = '#0369a1';

        if (mood === 'Tranquilo') {
            feedback.innerText = 'Que ótimo! Vamos aproveitar esse foco! 🌟';
        } else if (mood === 'Agitado') {
            feedback.innerText = 'Tudo bem sentir isso. Lembre de respirar fundo antes das tarefas! 💨';
        } else {
            feedback.innerText = 'Vá no seu ritmo, você está indo muito bem! 🐢';
        }
    }
}

// 2. Navegação entre Etapas
function nextStep(stepNumber) {
    safePlaySound('click');

    // 👇 ADIÇÃO AQUI: Pausa qualquer vídeo ou áudio ativo na tela atual ao avançar
    const activeVideo = document.querySelector('video');
    if (activeVideo) {
        activeVideo.pause();
        activeVideo.currentTime = 0; // Opcional: volta o vídeo para o início
    }

    const currentActive = document.querySelector('.step-card.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }

    const nextCard = document.getElementById(`step-${stepNumber}`);
    if (nextCard) {
        nextCard.classList.add('active');
    }
}

// 3. Termômetro das Emoções Dinâmico (5 Perguntas)
function loadEmotionQuestion() {
    const qTracker = document.getElementById('question-tracker');
    const qText = document.getElementById('emotion-question');
    const feedback = document.getElementById('emotion-feedback');
    const btnNext = document.getElementById('btn-next-question');
    const btnStep3 = document.getElementById('btn-to-step3');

    if (!qText) return;

    qTracker.innerText = `Pergunta ${currentQuestionIndex + 1} de ${emotionQuestions.length}`;
    qText.innerText = emotionQuestions[currentQuestionIndex].text;

    if (feedback) feedback.style.display = 'none';
    if (btnNext) btnNext.style.display = 'none';
    if (btnStep3) btnStep3.style.display = 'none';

    const buttons = document.querySelectorAll('.mood-option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
}

function selectEmotion(sentimento, emoji, btnElement) {
    safePlaySound('click');

    const buttons = document.querySelectorAll('.mood-option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    if (btnElement) {
        btnElement.classList.add('selected');
    }

    const feedback = document.getElementById('emotion-feedback');
    const btnNext = document.getElementById('btn-next-question');
    const btnStep3 = document.getElementById('btn-to-step3');

    if (feedback) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = '#f0f9ff';
        feedback.style.color = '#0369a1';
        feedback.style.border = '1px solid #bae6fd';

        const mensagens = {
'Frustração': `${emoji} Sentir frustração é normal quando algo não acontece como você esperava. Você pode fazer uma pausa e tentar novamente quando se sentir preparado.`,
'Tristeza': `${emoji} Tudo bem sentir tristeza. Se quiser, você pode descansar, conversar com alguém de confiança ou reservar um tempinho para você.`,
'Impaciência': `${emoji} Às vezes, dá vontade de resolver tudo rapidinho! Respirar com calma pode ajudar você a entender o que precisa neste momento.`,
'Calma': `${emoji} Que bom perceber como você está se sentindo! Você pode aproveitar esse momento tranquilo, respeitando sempre o seu próprio ritmo.`,
'Não sei': `${emoji} Tudo bem não saber identificar o que você sente agora. Às vezes, precisamos de um tempinho para entender nossas emoções. Você pode continuar!`
};

        feedback.innerHTML = mensagens[sentimento] || `${emoji} Todas as emoções são válidas e importantes!`;
    }

    if (currentQuestionIndex < emotionQuestions.length - 1) {
        if (btnNext) btnNext.style.display = 'block';
    } else {
        if (btnStep3) btnStep3.style.display = 'block';
    }
}

function nextEmotionQuestion() {
    if (currentQuestionIndex < emotionQuestions.length - 1) {
        currentQuestionIndex++;
        loadEmotionQuestion();
    }
}

// 4. Respiração Guiada em 3 Ciclos
function startBreathingCycles() {
const circle = document.getElementById('breath-circle');
const text = document.getElementById('breath-text');
const counter = document.getElementById('breath-counter');
const startBtn = document.getElementById('btn-breath');
const nextBtn = document.getElementById('btn-to-step4');

if (!circle || !text || !counter) return;

if (startBtn) startBtn.style.display = 'none';
if (nextBtn) nextBtn.style.display = 'none';

let currentCycle = 1;
const totalCycles = 3;

// Cada ciclo tem inspiração e expiração, sem prender o ar.
function runSingleCycle() {
    counter.innerText = `Ciclo ${currentCycle} de ${totalCycles}`;

    if (text) {
        text.innerText = 'Inspire suavemente, se for confortável... 🌬️';
    }

    if (circle) {
        circle.style.transition = 'transform 2.5s ease-in-out, background-color 0.5s ease';
        circle.style.transform = 'scale(1.6)';
        circle.style.backgroundColor = '#22c55e';
        circle.innerText = 'Inspire';
    }

    safePlaySound('breathe-in');

    setTimeout(() => {
        if (text) {
            text.innerText = 'Agora, solte o ar devagar... 💨';
        }

        if (circle) {
            circle.style.transform = 'scale(1)';
            circle.style.backgroundColor = '#3b82f6';
            circle.innerText = 'Solte';
        }

        safePlaySound('breathe-out');

        setTimeout(() => {
            if (currentCycle < totalCycles) {
                currentCycle++;
                runSingleCycle();
            } else {
                safePlaySound('success');

                if (text) {
                    text.innerText = 'Muito bem! Você terminou os 3 ciclos. Continue respirando no seu ritmo! ✨';
                }

                if (circle) {
                    circle.style.transform = 'scale(1)';
                    circle.style.backgroundColor = '#818cf8';
                    circle.innerText = 'Muito bem!';
                }

                if (counter) {
                    counter.innerText = '3 ciclos concluídos!';
                }

                if (nextBtn) {
                    nextBtn.style.display = 'block';
                }
            }
        }, 2500);
    }, 2500);
}

runSingleCycle();


}


// 5. Objetos de Ancoragem
function checkFocusObjects() {
    const feedback = document.getElementById('focus-feedback');
    const nextBtn = document.getElementById('btn-to-step5');

    if (feedback) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = '#dcfce7';
        feedback.style.color = '#15803d';
        feedback.innerText = 'Muito bem! Observar o ambiente é uma forma de trazer sua atenção para o presente. Você pode continuar mesmo sem preencher os campos! 🎯';
    }

    safePlaySound('success');

    if (nextBtn) {
        nextBtn.style.display = 'block';
    }
}


// 6. Conclusão Final
async function finishModule() {
    const supabaseClient = window.supabaseClient;
    const modal = document.getElementById('modal-conclusao');
    const pxElement = document.getElementById('user-px');
    const modalTotalElement = document.getElementById('modal-total-px');

        const pxMessage = document.getElementById('px-message');

    function showPxMessage(text, isError = false) {
        if (!pxMessage) return;

        pxMessage.textContent = text;
        pxMessage.style.display = 'block';
        pxMessage.style.color = isError ? '#dc2626' : '#16a34a';
    }

    // Verifica se o Supabase está disponível
    if (!supabaseClient) {
        console.error('Cliente Supabase não encontrado.');
        showPxMessage(
            'Não foi possível conectar ao sistema de PX. Tente novamente.',
            true
        );
        return;
    }

    // Verifica se o usuário está autenticado
    const { data: { user }, error: authError } =
        await supabaseClient.auth.getUser();

    if (authError || !user) {
        console.error('Usuário não autenticado:', authError);
        showPxMessage('Entre na sua conta para salvar seus PX!', true);
        return;
    }

    // Registra a conclusão e solicita os PX ao Supabase
    const { data, error } = await supabaseClient.rpc(
        'complete_emotional_management'
    );

    if (error || !data || !data.success) {
        console.error('Erro ao registrar os PX:', error || data);
        showPxMessage(
            'Não foi possível salvar seus PX. Tente novamente.',
            true
        );
        return;
    }

    // Atualiza a interface com o saldo verdadeiro do banco
    const totalPX = Number(data.total_xp) || 0;
    const nivel = Math.floor(totalPX / 100) + 1;

    localStorage.setItem('userPX', totalPX);

    if (pxElement) {
        pxElement.innerText = `⚡ ${totalPX} PX`;
    }

    if (modalTotalElement) {
        modalTotalElement.innerText = `⚡ ${totalPX} PX`;
    }

    const levelElement = document.getElementById('user-level');
    if (levelElement) {
        levelElement.innerText = `Nível ${nivel}`;
    }

    if (data.awarded) {
        console.log('Gestão Emocional concluída: +100 PX salvos!');
    } else {
        console.log('Os PX da Gestão Emocional já foram concedidos anteriormente.');
    }

    safePlaySound('victory');

    if (modal) {
        modal.style.display = 'flex';
    }

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}


function redirectHome() {
    window.location.href = 'index.html';
}