// URL do backend
window.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('cadastro.html')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return; // Adicionar return para evitar execução adicional
        }

        // Função para cadastrar um chamado
        document.getElementById('cadastrarChamadoForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Coletar dados do formulário
            const cliente = document.getElementById('cliente').value;
            const telefone = document.getElementById('telefone').value;
            const categoriaId = document.getElementById('categoriaId').value;
            const descricao = document.getElementById('descricao').value;
            
            // Verificar se os campos necessários estão preenchidos
            if (!cliente || !telefone || !categoriaId || !descricao) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            // Post Cadastro

            try {
                const response = await fetch(`https://backend-provider.onrender.com/api/chamado`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ cliente, telefone, categoriaId, descricao }),
                });

                if (response.ok) {
                    alert('Chamado cadastrado com sucesso!');
                    // Limpar o formulário
                    document.getElementById('cadastrarChamadoForm').reset();
                } else {
                    const data = await response.json();
                    alert(`Erro: ${data.message}`);
                }

                const data = await response.json();
                const chamadoid = data._id;
                console.log(chamadoid)


            } catch (error) {
                console.error('Erro ao cadastrar chamado:', error);
                alert('Ocorreu um erro ao tentar cadastrar o chamado.');
            }
        });
    }
});
