// ============================================
// APRENDQUEST - CONEXÃO COM O SUPABASE
// ============================================

const SUPABASE_URL = 'https://vpwbzqfslqqdcuubviyy.supabase.co';

const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_99VGr-yhy-0rb6L31LQowg_bi37L2g2';

// Criar conexão com o Supabase
if (!window.supabase) {
    throw new Error('Biblioteca do Supabase não foi carregada.');
}

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log('Conexão do AprendQuest com o Supabase inicializada.');