// Banco com 5 Situações do Cotidiano para a Missão 2
const emotionQuestions = [
    {
        id: 1,
        text: "Quando algo atrapalha o seu dia (como a internet cair ou o jogo fechar sozinho), o que costuma se passar dentro de você?"
    },
    {
        id: 2,
        text: "Quando você se esforça muito em uma tarefa ou desenho e algo dá errado, qual é a primeira reação do seu corpo?"
    },
    {
        id: 3,
        text: "Quando alguém te interrompe no meio de algo muito legal que você estava fazendo, como você se sente?"
    },
    {
        id: 4,
        text: "Quando você tenta aprender algo novo pela primeira vez e não consegue de primeira, qual emoção aparece?"
    },
    {
        id: 5,
        text: "Quando os planos mudam de última hora e você precisa fazer outra coisa, como seu coração reage?"
    }
];

let currentQuestionIndex = 0;

// Carrega os PX salvos e a primeira pergunta assim que a página abre
document.addEventListener('DOMContentLoaded', () => {
    let pxAtual = parseInt(localStorage.getItem('userPX')) || 200;
    const pxElement = document.getElementById('user-px');
    if (pxElement) {
        pxElement.innerText = `⚡ ${pxAtual} PX`;
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
            'Frustração': `${emoji} **A frustração é super normal nesses momentos!** Ela só mostra que aquilo era importante para você. Respirar fundo ajuda a desacelerar.`,
            'Tristeza': `${emoji} **É compreensível sentir tristeza.** Guardar o sentimento não ajuda, mas fazer uma pausa ou conversar com alguém renova a mente.`,
            'Impaciência': `${emoji} **A impaciência dá aquela vontade de agir na hora!** É o seu corpo acelerado. Parar alguns segundos te devolve o controle.`,
            'Calma': `${emoji} **Muito bem por manter a serenidade!** Conseguir respirar e não se estressar de primeira é um ótimo superpoder.`
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

    if (startBtn) startBtn.style.display = 'none';
    let currentCycle = 1;
    const totalCycles = 3;

    function runSingleCycle() {
        if (counter) counter.innerText = `Ciclo ${currentCycle} de ${totalCycles}`;
        
        safePlaySound('breathe-in');
        if (text) text.innerText = 'Inspire fundo pelo nariz... 🌬️';
        if (circle) {
            circle.style.transform = 'scale(2.2)';
            circle.style.backgroundColor = '#22c55e';
            circle.innerText = 'Inspire';
        }

        setTimeout(() => {
            if (text) text.innerText = 'Segure o ar... ⏸️';
            if (circle) {
                circle.style.backgroundColor = '#eab308';
                circle.innerText = 'Segure';
            }

            setTimeout(() => {
                safePlaySound('breathe-out');
                if (text) text.innerText = 'Solte devagar pela boca... 💨';
                if (circle) {
                    circle.style.transform = 'scale(1)';
                    circle.style.backgroundColor = '#3b82f6';
                    circle.innerText = 'Solte';
                }

                setTimeout(() => {
                    if (currentCycle < totalCycles) {
                        currentCycle++;
                        runSingleCycle();
                    } else {
                        safePlaySound('success');
                        if (text) text.innerText = 'Excelente! Você completou os 3 ciclos! ✨';
                        if (circle) {
                            circle.innerText = 'Relaxado!';
                            circle.style.backgroundColor = '#818cf8';
                        }
                        if (nextBtn) nextBtn.style.display = 'block';
                    }
                }, 2500);

            }, 2000);

        }, 2500);
    }

    runSingleCycle();
}

// 5. Objetos de Ancoragem
function checkFocusObjects() {
    const obj1 = document.getElementById('object-1').value.trim();
    const obj2 = document.getElementById('object-2').value.trim();
    const obj3 = document.getElementById('object-3').value.trim();
    const feedback = document.getElementById('focus-feedback');
    const nextBtn = document.getElementById('btn-to-step5');

    if (feedback) feedback.style.display = 'block';

    if (obj1 !== '' && obj2 !== '' && obj3 !== '') {
        safePlaySound('success');
        if (feedback) {
            feedback.style.backgroundColor = '#dcfce7';
            feedback.style.color = '#15803d';
            feedback.innerText = 'Excelente! Você trouxe sua mente de volta para o momento presente! 🎯';
        }
        if (nextBtn) nextBtn.style.display = 'block';
    } else {
        safePlaySound('click');
        if (feedback) {
            feedback.style.backgroundColor = '#fee2e2';
            feedback.style.color = '#b91c1c';
            feedback.innerText = 'Preencha os 3 campos com objetos que você consegue ver ao seu redor agora! 🔎';
        }
    }
}

// 6. Conclusão Final
function finishModule() {
    const textInput = document.getElementById('gratitude-text');
    const text = textInput ? textInput.value.trim() : '';

    if (text === '') {
        alert('Escreva pelo menos uma palavrinha sobre algo bom do seu dia!');
        return;
    }

    let pxAtual = parseInt(localStorage.getItem('userPX')) || 200;
    let novoPX = pxAtual + 100;
    localStorage.setItem('userPX', novoPX);

    const pxElement = document.getElementById('user-px');
    if (pxElement) {
        pxElement.innerText = `⚡ ${novoPX} PX`;
    }

    const modalTotalElement = document.getElementById('modal-total-px');
    if (modalTotalElement) {
        modalTotalElement.innerText = `⚡ ${novoPX} PX`;
    }

    safePlaySound('victory');

    const modal = document.getElementById('modal-conclusao');
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