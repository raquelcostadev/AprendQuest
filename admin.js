document.addEventListener('DOMContentLoaded', async () => {
    const studentsGrid = document.getElementById('students-grid');

    let firstLoad = true;

    function showMessage(message, isError = false) {
        studentsGrid.replaceChildren();

        const paragraph = document.createElement('p');
        paragraph.className = isError
            ? 'admin-message admin-error'
            : 'admin-message';

        paragraph.textContent = message;
        studentsGrid.appendChild(paragraph);
    }

    async function loadStudents() {
        try {
            const supabaseClient = window.supabaseClient;

            if (!supabaseClient) {
                showMessage(
                    'Não foi possível conectar ao banco de dados.',
                    true
                );
                return;
            }

            // Verifica a sessão da pessoa autenticada.
            const {
                data: { user },
                error: authError
            } = await supabaseClient.auth.getUser();

            if (authError || !user) {
                showMessage(
                    'Faça login com sua conta de administradora.',
                    true
                );
                return;
            }

            // Confirma se a pessoa é administradora.
            const { data: isAdmin, error: adminError } =
                await supabaseClient.rpc('is_admin');

            if (adminError || isAdmin !== true) {
                showMessage(
                    'Acesso negado. Esta página é exclusiva para administradores.',
                    true
                );
                return;
            }

            // Busca os perfis atualizados.
            const { data: profiles, error: profilesError } =
                await supabaseClient
                    .from('profiles')
                    .select('id, name, character_name')
                    .order('name', { ascending: true });

            if (profilesError) {
                console.error(
                    'Erro ao buscar alunos:',
                    profilesError
                );

                if (firstLoad) {
                    showMessage(
                        'Não foi possível carregar os alunos.',
                        true
                    );
                }
                return;
            }

            // Busca os níveis atuais.
            const { data: progress, error: progressError } =
                await supabaseClient
                    .from('user_progress')
                    .select('user_id, level');

            if (progressError) {
                console.error(
                    'Erro ao buscar níveis:',
                    progressError
                );

                if (firstLoad) {
                    showMessage(
                        'Não foi possível carregar os níveis dos alunos.',
                        true
                    );
                }
                return;
            }

            if (!profiles || profiles.length === 0) {
                showMessage('Nenhum aluno cadastrado ainda.');
                firstLoad = false;
                return;
            }

            const progressByUser = new Map(
                (progress || []).map(item => [
                    item.user_id,
                    item
                ])
            );

                      // Personagens utilizados no AprendQuest.
            const characterEmojis = {
                Mago: '🧙‍♂️',
                Cavalheiro: '⚔️',
                Cientista: '🧪',
                Astronauta: '👩‍🚀',
                Programadora: '🤖',
                Hacker: '👨‍💻'
            };

            const table = document.createElement('table');
            table.className = 'students-table';

            // Cabeçalho da tabela
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            ['Personagem', 'Nome do aluno', 'Nível'].forEach(title => {
                const th = document.createElement('th');
                th.textContent = title;
                th.scope = 'col';
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Corpo da tabela
            const tbody = document.createElement('tbody');

            profiles.forEach(profile => {
                const row = document.createElement('tr');

                // Personagem
                const characterCell = document.createElement('td');
                characterCell.className = 'table-character';
                characterCell.textContent =
                    characterEmojis[profile.character_name] || '🎮';

                characterCell.setAttribute(
                    'aria-label',
                    `Personagem: ${profile.character_name || 'Não escolhido'}`
                );

                // Nome do aluno
                const nameCell = document.createElement('td');
                nameCell.className = 'table-student-name';
                nameCell.textContent = profile.name || 'Aluno sem nome';

                // Nível
                const levelCell = document.createElement('td');
                levelCell.className = 'table-student-level';

                const studentProgress = progressByUser.get(profile.id);

                levelCell.textContent =
                    `Nível ${studentProgress?.level ?? 1}`;

                row.append(characterCell, nameCell, levelCell);
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            studentsGrid.replaceChildren(table);

            firstLoad = false;
        } catch (error) {
            console.error(
                'Erro inesperado no painel:',
                error
            );

            if (firstLoad) {
                showMessage(
                    'Ocorreu um erro ao carregar o painel.',
                    true
                );
            }
        }
    }

    // Carrega os alunos ao abrir a página.
    await loadStudents();

    // Atualiza os dados automaticamente a cada 5 segundos.
    setInterval(loadStudents, 5000);
});