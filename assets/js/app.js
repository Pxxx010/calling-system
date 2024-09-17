// Função de login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`https://backend-provider.onrender.com/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });


        const data = await response.json();

        if (response.ok) {
            // Armazena o token e o id no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('id', data.id); // Usa data.id diretamente
            window.location.href = 'home.html';
        } else {
            document.getElementById('errorMessage').innerText = data.message;
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

// Função para verificar autenticação e carregar chamados na home
window.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('home.html')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return; // Adicionar return para evitar execução adicional
        }

        // Carregar chamados
        try {
            const response = await fetch(`https://backend-provider.onrender.com/api/chamado`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const chamados = await response.json();
                const chamadosAbertos = chamados.filter(p => p.status === 'aberto'); // Filtra apenas os chamados abertos

                // Ordenar os chamados por data de criação (mais antigo primeiro)
                chamadosAbertos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                const chamadoslist = document.getElementById('chamadoslist');
                chamadoslist.innerHTML = chamadosAbertos.map(p => `
                    <div class="card chamado-card">
                        <div class="card-header">
                            <strong>Cliente:</strong> ${p.cliente}
                        </div>
                        <div class="card-body">
                            <p><strong>Descrição:</strong> ${p.descricao}</p>
                            <p><strong>Categoria:</strong> ${p.categoriaId}</p>
                            <p><strong>Status:</strong> <span class="status-label ${p.status}">${p.status}</span></p>
                            <p><strong>Data de criação:</strong> ${new Date(p.createdAt).toLocaleDateString()}</p>
                            <button class="btn btn-primary" onclick="mudarStatus('${p._id}', '${p.cliente}')">Concluir</button>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Erro ao carregar chamados:', error);
        }

        // Logout
        document.getElementById('logoutButton')?.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            window.location.href = 'index.html';
        });
    }
});

// Função para mudar o status do chamado
async function mudarStatus(id, cliente) {
    const token = localStorage.getItem('token'); // Recupera o token do localStorage

    // Mostrar a caixa de confirmação com o nome do cliente
    const confirmacao = confirm(`Você tem certeza que deseja concluir o chamado do cliente ${cliente}?`);
    if (!confirmacao) {
        return; // Se o usuário clicar em "Cancelar", não faz nada
    }

    try {
        const response = await fetch(`https://backend-provider.onrender.com/api/chamado/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: 'concluído' })
        });

        if (response.ok) {
            alert('Chamado concluído com sucesso!');
            // Recarregar a lista de chamados
            window.location.reload();
        } else {
            console.error('Erro ao concluir chamado');
        }
    } catch (error) {
        console.error('Erro ao mudar o status do chamado:', error);
    }
}
