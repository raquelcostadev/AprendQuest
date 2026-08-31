// --- SISTEMA GLOBAL DE ÁUDIO (WEB AUDIO API) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    // Desbloqueia o áudio em navegação/interação
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

const SoundFX = {
    // 1. Click Suave (Para qualquer botão da interface)
    playClick: function() {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) { console.log(e); }
    },

    // 2. Acerto / Encaixe / Resposta Certa (Pop estimulante)
    playSuccess: function() {
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
    },

    // 3. Erro (Tom grave, amigável e não-punitivo)
    playError: function() {
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
    },

    // 4. Vitória / Conclusão de Fase (Arpejo gratificante)
    playVictory: function() {
        try {
            const ctx = getAudioContext();
            const notes = [261.63, 329.63, 392.00, 523.25]; // Do - Mi - Sol - Do

            notes.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.value = freq;

                const startTime = ctx.currentTime + (index * 0.09);
                gain.gain.setValueAtTime(0.2, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.28);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.28);
            });
        } catch (e) { console.log(e); }
    }
};
// Ativa o som de clique automaticamente em qualquer botão ou elemento clicável
document.addEventListener('click', (event) => {
    // Se o elemento clicado for um botão, card ou tiver a classe clicável
    if (event.target.closest('button, .part-btn, .option-btn, .btn-green-round, a')) {
        SoundFX.playClick();
    }
});