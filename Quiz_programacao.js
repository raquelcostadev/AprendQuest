const programmingQuestions = [
    {
        id: 1,
        question: "O que é uma variável na programação?",
        options: [
            "A) Um componente físico da placa-mãe",
            "B) Um espaço na memória para armazenar dados",
            "C) Um cabo que conecta a internet",
            "D) Um comando para desligar o computador"
        ],
        correctIndex: 1
    },
    {
        id: 2,
        question: "Para que serve uma estrutura condicional IF/ELSE?",
        options: [
            "A) Para repetir um trecho de código infinitamente",
            "B) Para tomar decisões determinadas em uma condição",
            "C) Para apagar o histórico do navegador",
            "D) Para multiplicar números automaticamente"
        ],
        correctIndex: 1
    },
    {
        id: 3,
        question: "O que acontece quando dizemos que uma variável guardou 'Ana'?",
        options: [
            "A) O computador imprime o nome no papel",
            "B) O programa salva o texto 'Ana' para usar depois",
            "C) A caixa de som fala o nome alto",
            "D) O monitor muda de cor"
        ],
        correctIndex: 1
    }
];

let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let attemptsLeft = 2;

// Inicia no Nível 2 acumulado
let currentPX = 100;
let currentLevel = 2;

function playSound(type) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'success') {
        // Som alegre de "moedinha / conquista" (três notas subindo rápido)
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'triangle'; // Som mais suave e fofo (tipo flauta/marimba)
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (index * 0.08));
            
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime + (index * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (index * 0.08) + 0.2);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(audioCtx.currentTime + (index * 0.08));
            osc.stop(audioCtx.currentTime + (index * 0.08) + 0.2);
        });
    } else {
        // Som suave e amortecido para erro (sem sustos)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    }
}

function startQuizQuestions() {
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('quiz-screen').classList.add('active');
    loadQuestion();
}

function loadQuestion() {
    const q = programmingQuestions[currentQuestionIndex];
    selectedOptionIndex = null;
    attemptsLeft = 2;

    hideFeedback();

    const progressPercent = Math.round(((currentQuestionIndex + 1) / programmingQuestions.length) * 100);
    
    document.getElementById('quiz-question-counter').innerText = `Pergunta ${currentQuestionIndex + 1} de ${programmingQuestions.length}`;
    
    const progressFill = document.getElementById('quiz-progress-fill');
    const progressText = document.getElementById('quiz-progress-text');
    if (progressFill && progressText) {
        progressFill.style.width = `${progressPercent}%`;
        progressText.innerText = `${progressPercent}%`;
    }

    document.getElementById('quiz-question-text').innerText = q.question;

    const optionsContainer = document.getElementById('quiz-options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach((optionText, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn';
        btn.innerText = optionText;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });

    const confirmBtn = document.getElementById('btn-confirm-answer');
    confirmBtn.disabled = true;
    confirmBtn.innerText = "Confirmar Resposta";
}

function selectOption(index, btnElement) {
    selectedOptionIndex = index;

    document.querySelectorAll('.quiz-option-btn').forEach(b => {
        if (!b.classList.contains('wrong-disabled')) {
            b.classList.remove('selected');
        }
    });
    
    btnElement.classList.add('selected');
    document.getElementById('btn-confirm-answer').disabled = false;
}


async function addExperience(questionId) {
    const supabaseClient = window.supabaseClient;

    if (!supabaseClient) {
        console.error('Cliente Supabase não encontrado.');
        return false;
    }

    const { data: { user }, error: authError } =
        await supabaseClient.auth.getUser();

    if (authError || !user) {
        console.error('É necessário entrar na conta para receber PX.');
        showFeedback(
            'Entre na sua conta para salvar seus PX!',
            '🔒',
            'warning'
        );
        return false;
    }

    const { data, error } = await supabaseClient.rpc(
        'complete_programming_question',
        { p_question_id: questionId }
    );

    if (error || !data || !data.success) {
        console.error('Erro ao registrar os PX:', error || data);
        showFeedback(
            'Não foi possível salvar os PX. Tente novamente!',
            '⚠️',
            'warning'
        );
        return false;
    }

    currentPX = data.total_xp;
    currentLevel = Math.floor(currentPX / 100) + 1;

    const pxTag = document.getElementById('user-px');
    const levelTag = document.getElementById('user-level');

    if (pxTag) {
        pxTag.innerText = `⚡ ${currentPX} PX`;
        pxTag.classList.add('px-gain');

        setTimeout(() => {
            pxTag.classList.remove('px-gain');
        }, 400);
    }

    if (levelTag) {
        levelTag.innerText = `Nível ${currentLevel}`;
    }

    if (data.awarded) {
        console.log(`Pergunta ${questionId}: +35 PX salvos!`);
    } else {
        console.log('Você já recebeu PX por essa pergunta.');
    }

    return true;
}



function showFeedback(text, icon, type) {
    const box = document.getElementById('feedback-box');
    const textEl = document.getElementById('feedback-text');
    const iconEl = document.getElementById('feedback-icon');

    box.className = `feedback-box ${type}`;
    textEl.innerText = text;
    iconEl.innerText = icon;
}

function hideFeedback() {
    const box = document.getElementById('feedback-box');
    if (box) box.className = 'feedback-box hidden';
}

async function confirmAnswer() {
    if (selectedOptionIndex === null) return;

    const currentQuestion = programmingQuestions[currentQuestionIndex];
    const confirmBtn = document.getElementById('btn-confirm-answer');
    const optionButtons = document.querySelectorAll('.quiz-option-btn');
    const selectedBtn = optionButtons[selectedOptionIndex];

    if (selectedOptionIndex === currentQuestion.correctIndex) {
    selectedBtn.style.backgroundColor = '#22C55E';
    selectedBtn.style.color = '#FFFFFF';
    confirmBtn.disabled = true;

    playSound('success');

    const xpSaved = await addExperience(currentQuestion.id);

if (!xpSaved) {
    confirmBtn.disabled = false;
    return;
}

 showFeedback("Fantástico! Resposta certa!", "🌟", "success");

    setTimeout(() => {
        nextQuestion();
    }, 1200);

    } else {
        attemptsLeft--;

        if (attemptsLeft === 1) {
            selectedBtn.style.backgroundColor = '#EF4444';
            selectedBtn.style.color = '#FFFFFF';
            selectedBtn.classList.add('wrong-disabled');
            selectedBtn.disabled = true;
            
            playSound('error'); // Toca som de erro (primeira tentativa)
            showFeedback("Ops! Tente mais uma vez!", "🙈", "warning");

            selectedOptionIndex = null;
            confirmBtn.disabled = true;

        } else {
            selectedBtn.style.backgroundColor = '#EF4444';
            selectedBtn.style.color = '#FFFFFF';
            
            optionButtons[currentQuestion.correctIndex].style.backgroundColor = '#22C55E';
            optionButtons[currentQuestion.correctIndex].style.color = '#FFFFFF';
            
            confirmBtn.disabled = true;

            playSound('error'); // Toca som de erro definitivo
            showFeedback("Sem problemas! A resposta certa acendeu em verde.", "🚀", "error");

            setTimeout(() => {
                nextQuestion();
            }, 2000);
        }
    }
}

function nextQuestion() {
    if (currentQuestionIndex < programmingQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showFeedback("Incrível! Você concluiu o Quiz de Programação! Indo para Hardware...", "🏆", "success");
        
        localStorage.setItem('userPX', currentPX);
        
        setTimeout(() => {
            window.location.href = 'Quiz_hardware.html';
        }, 1800);
    }
}