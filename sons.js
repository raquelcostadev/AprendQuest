// Sistema de Efeitos Sonoros com Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
        // Som curto de clique
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);

    } else if (type === 'success') {
        // Som de acerto / avanço
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);

    } else if (type === 'breathe-in') {
        // Tom suave e grave subindo (Inspirar)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 2.0);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 1.0);
        gain.gain.linearRampToValueAtTime(0.01, now + 2.5);
        osc.start(now);
        osc.stop(now + 2.5);

    } else if (type === 'breathe-out') {
        // Tom suave desce (Expirar)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 2.0);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 2.5);
        osc.start(now);
        osc.stop(now + 2.5);

    } else if (type === 'victory') {
        // Arpejo de vitória (Fanfarra do Modal)
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            const noteOsc = audioCtx.createOscillator();
            const noteGain = audioCtx.createGain();
            noteOsc.connect(noteGain);
            noteGain.connect(audioCtx.destination);

            noteOsc.type = 'triangle';
            noteOsc.frequency.setValueAtTime(freq, now + (index * 0.12));
            noteGain.gain.setValueAtTime(0.2, now + (index * 0.12));
            noteGain.gain.exponentialRampToValueAtTime(0.01, now + (index * 0.12) + 0.4);

            noteOsc.start(now + (index * 0.12));
            noteOsc.stop(now + (index * 0.12) + 0.4);
        });
    }
}