// --- SISTEMA DE ÁUDIO PARA O DESAFIO FINAL ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// 1. Som de Encaixe/Acerto
function playSuccessSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    } catch (e) { console.log(e); }
}

// 2. Som de Erro Suave
function playErrorSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) { console.log(e); }
}

// 3. Som de Vitória / Parabéns
function playVictorySound() {
    try {
        const ctx = getAudioContext();
        const notes = [261.63, 329.63, 392.00, 523.25]; // Dó - Mi - Sol - Dó

        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = ctx.currentTime + (index * 0.1);
            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.35);
        });
    } catch (e) { console.log(e); }
}


const buildSequence = [
    { key: "motherboard", name: "Placa-Mãe", instruction: "Primeiro, selecione a <strong>Placa-Mãe</strong> para servir de base!" },
    { key: "cpu", name: "Processador", instruction: "Agora encaixe o <strong>Processador (CPU)</strong>, o cérebro que faz os cálculos!" },
    { key: "ram", name: "Memória RAM", instruction: "Adicione a <strong>Memória RAM</strong> para guardar os dados em uso!" },
    { key: "case", name: "Gabinete", instruction: "Feche tudo dentro do <strong>Gabinete (Torre)</strong>!" },
    { key: "monitor", name: "Monitor", instruction: "Posicione o <strong>Monitor</strong> no centro da mesa!" },
    { key: "keyboard", name: "Teclado", instruction: "Encaixe o <strong>Teclado</strong> logo à frente do monitor!" },
    { key: "mouse", name: "Mouse", instruction: "Por fim, adicione o <strong>Mouse</strong> ao lado do teclado!" }
];

let currentStep = 0;

function updateManual() {
    if (currentStep < buildSequence.length) {
        document.getElementById('step-badge').innerText = `Passo ${currentStep + 1} de ${buildSequence.length}`;
        document.getElementById('instruction-text').innerHTML = buildSequence[currentStep].instruction;
    } else {
        document.getElementById('step-badge').innerText = "Concluído!";
        document.getElementById('instruction-text').innerHTML = "<strong>Espetacular!</strong> Seu computador está 100% montado e pronto para ligar!";
    }
}

function tryAssemble(partKey) {
    const expectedPart = buildSequence[currentStep].key;

    if (partKey === expectedPart) {
        // ACERTO: Check Verde
        showOverlay("✅", "success");
        playSuccessSound();

        // Se for o Gabinete, esconde as peças internas
        if (partKey === 'case') {
            document.getElementById('slot-motherboard').classList.add('hidden');
            document.getElementById('slot-cpu').classList.add('hidden');
            document.getElementById('slot-ram').classList.add('hidden');
        }

        // Revela a peça atual na tela
        const piece = document.getElementById(`slot-${partKey}`);
        piece.classList.remove('hidden');
        piece.classList.add('snap-in');

        // Desativa o botão clicado
        const btn = document.querySelector(`button[onclick="tryAssemble('${partKey}')"]`);
        if (btn) btn.classList.add('disabled');

        currentStep++;

        setTimeout(() => {
            hideOverlay();
            updateManual();

            if (currentStep === buildSequence.length) {
                finishAssembly();
            }
        }, 900);

    } else {
        // ERRO: X Vermelho
        showOverlay("❌", "error");
        playErrorSound();
        setTimeout(() => {
            hideOverlay();
        }, 800);
    }
}

function showOverlay(icon, type) {
    const overlay = document.getElementById('status-overlay');
    const iconSpan = document.getElementById('status-icon');
    
    iconSpan.innerText = icon;
    overlay.className = `status-overlay ${type}`;
}

function hideOverlay() {
    document.getElementById('status-overlay').className = 'status-overlay hidden';
}

function finishAssembly() {
    // 1. Animação de celebração na mesa
    const desk = document.getElementById('desk-workspace');
    if (desk) desk.classList.add('complete');

    // 2. Esconde o inventário de peças
    const inventory = document.getElementById('parts-inventory');
    if (inventory) inventory.classList.add('hidden');

    // 3. EFEITO DE MONITOR LIGANDO CENTRALIZADO 🖥️⚡
    const monitorSlot = document.getElementById('slot-monitor');
    if (monitorSlot) {
        monitorSlot.classList.add('monitor-screen-on');
        monitorSlot.innerHTML = `
            <div class="monitor-boot-content">
                <span class="monitor-boot-icon">⚡</span>
                <span class="monitor-boot-text">PC LIGADO!</span>
            </div>
        `;
    }

    // 4. Aguarda 3.5 segundos para visualizar e exibe a Modal de Parabéns
    setTimeout(() => {
        if (typeof playVictorySound === 'function') {
            playVictorySound();
        }

        const modal = document.getElementById('congratulations-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }, 3500);
}

// REDIRECIONAMENTO PARA A TRILHA AO CONCLUIR OU SAIR
document.addEventListener('DOMContentLoaded', () => {
    // Captura o botão dentro da modal de parabéns ou botão de voltar da página
    const btnReturnToTrail = document.getElementById('btn-back-to-trail') || document.getElementById('btn-finish-challenge');
    
    if (btnReturnToTrail) {
        btnReturnToTrail.addEventListener('click', () => {
            window.location.href = 'organizacao.html';
        });
    }

    if (btnFinishBuild) {
        btnFinishBuild.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'organizacao.html';
        });
    }
});


