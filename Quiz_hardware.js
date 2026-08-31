const hardwareQuestions = [
    {
        id: 1,
        question: "Qual componente é considerado o cérebro do computador?",
        options: [
            "A) Memória RAM",
            "B) Processador",
            "C) Disco Rígido (SSD/HD)",
            "D) Fonte de Alimentação"
        ],
        correctIndex: 1
    },
    {
        id: 2,
        question: "Qual porta é usada para conectar periféricos como mouses e teclados?",
        options: [
            "A) Porta HDMI",
            "B) Porta USB",
            "C) Porta Ethernet",
            "D) Porta VGA"
        ],
        correctIndex: 1
    },
    {
        id: 3,
        question: "Qual componente é responsável por armazenar arquivos e programas permanentemente?",
        options: [
            "A) Memória RAM",
            "B) Placa de Vídeo",
            "C) Disco Rígido (SSD/HD)",
            "D) Processador"
        ],
        correctIndex: 2
    },
    {
        id: 4,
        question: "Qual componente fornece energia elétrica para todas as peças do computador?",
        options: [
            "A) Fonte de Alimentação",
            "B) Placa-Mãe",
            "C) Memória Cache",
            "D) Cooler"
        ],
        correctIndex: 0
    },
    {
        id: 5,
        question: "Para que serve a Memória RAM no computador?",
        options: [
            "A) Guardar fotos e vídeos para sempre",
            "B) Guardar dados temporários em uso",
            "C) Gerar imagens para o monitor",
            "D) Resfriar o gabinete"
        ],
        correctIndex: 1
    }
];

let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let attemptsLeft = 2;
let currentPX = 0;
let currentLevel = 1;

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

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
});

function loadQuestion() {
    const q = hardwareQuestions[currentQuestionIndex];
    selectedOptionIndex = null;
    attemptsLeft = 2;

    hideFeedback();

    const progressPercent = Math.round(((currentQuestionIndex + 1) / hardwareQuestions.length) * 100);
    
    document.getElementById('quiz-question-counter').innerText = `Pergunta ${currentQuestionIndex + 1} de ${hardwareQuestions.length}`;
    
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

function confirmAnswer() {
    if (selectedOptionIndex === null) return;

    const currentQuestion = hardwareQuestions[currentQuestionIndex];
    const confirmBtn = document.getElementById('btn-confirm-answer');
    const optionButtons = document.querySelectorAll('.quiz-option-btn');
    const selectedBtn = optionButtons[selectedOptionIndex];

    if (selectedOptionIndex === currentQuestion.correctIndex) {
        selectedBtn.style.backgroundColor = '#22C55E';
        selectedBtn.style.color = '#FFFFFF';
        confirmBtn.disabled = true;

        playSound('success'); // Toca som de acerto
        addExperience(20);

        showFeedback("Boa! Você mandou super bem!", "🌟", "success");

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
            
            playSound('error'); // Toca som de erro na 1ª tentativa
            showFeedback("Ops! Essa não é a certa. Tente mais uma vez!", "🙈", "warning");

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
    if (currentQuestionIndex < hardwareQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showFeedback("Incrível! Você concluiu a missão de Hardware!", "🏆", "success");
        setTimeout(() => {
            window.location.href = "Desafio_final.html";
        }, 1800);
    }
}

function addExperience(points) {
    currentPX += points;
    const pxTag = document.getElementById('user-px');
    const levelTag = document.getElementById('user-level');

    if (currentPX >= 100) {
        currentLevel++;
        currentPX = currentPX - 100;
        if (levelTag) levelTag.innerText = `Nível ${currentLevel}`;
        showFeedback(`Subiu para o Nível ${currentLevel}! 🎉`, "⭐", "success");
    }

    if (pxTag) {
        pxTag.innerText = `⚡ ${currentPX} / 100 PX`;
        pxTag.classList.add('px-gain');
        setTimeout(() => pxTag.classList.remove('px-gain'), 400);
    }
}