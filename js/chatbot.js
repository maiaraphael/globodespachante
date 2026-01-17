const chatbotData = {
    start: {
        text: "Olá! Como posso ajudar você hoje?",
        options: [
            { label: "Documentos para Transferência", next: "transferencia_tipo" },
            { label: "Perda do Recibo (2ª Via)", next: "segunda_via_tipo" },
            { label: "Horário de Atendimento", next: "horario" },
            { label: "Troca de Motor", next: "motor" },
            { label: "Pagamento IPVA PR", next: "ipva_pr" },
        ]
    },
    transferencia_tipo: {
        text: "Para transferência, preciso saber: Quem é o comprador?",
        options: [
            { label: "Pessoa Física (CPF)", next: "transf_pf" },
            { label: "Pessoa Jurídica (CNPJ)", next: "transf_pj" },
            { label: "Voltar", next: "start" }
        ]
    },
    transf_pf: {
        text: "<strong>Documentos para Pessoa Física:</strong><br><br>• Documento oficial com foto e CPF<br>• Comprovante de endereço<br>• CRV (Original ou ATPV-e) ou Procuração de venda<br>• Quitar débitos (IPVA, etc.)<br>• Veículo para vistoria<br><br><em>Se o vendedor for PJ, precisa também de Contrato Social e CND (se valor > R$84k).</em>",
        options: [
            { label: "Voltar ao Início", next: "start" }
        ]
    },
    transf_pj: {
        text: "<strong>Documentos para Pessoa Jurídica:</strong><br><br>• Cartão CNPJ<br>• CRV (Original ou ATPV-e) ou Procuração de venda<br>• Quitar débitos<br>• Veículo para vistoria<br><br><em>Se o vendedor for PJ, precisa também de Contrato Social e CND (se valor > R$84k).</em>",
        options: [
            { label: "Voltar ao Início", next: "start" }
        ]
    },
    segunda_via_tipo: {
        text: "Para 2ª Via do CRV, o proprietário é:",
        options: [
            { label: "Pessoa Física (CPF)", next: "segunda_via_pf" },
            { label: "Pessoa Jurídica (CNPJ)", next: "segunda_via_pj" },
            { label: "Voltar", next: "start" }
        ]
    },
    segunda_via_pf: {
        text: "<strong>2ª Via para Pessoa Física:</strong><br><br>• Documento oficial com foto e CPF<br>• Comprovante de endereço<br>• Quitar Débitos<br>• Declaração de Extravio<br>• Veículo para vistoria",
        options: [
            { label: "Voltar ao Início", next: "start" }
        ]
    },
    segunda_via_pj: {
        text: "<strong>2ª Via para Pessoa Jurídica:</strong><br><br>• Cartão CNPJ<br>• Quitar Débitos<br>• Declaração de Extravio<br>• Veículo para vistoria",
        options: [
            { label: "Voltar ao Início", next: "start" }
        ]
    },
    horario: {
        text: "<strong>Nosso Horário de Atendimento:</strong><br><br>🕒 Segunda a Sexta: 08:00 às 18:00<br>🕒 Sábado: 08:00 às 12:00",
        options: [
            { label: "Voltar ao Início", next: "start" }
        ]
    },
    motor: {
        text: "<strong>Para Troca de Motor é necessário:</strong><br><br>1. Verificar disponibilidade do nº do motor no Detran-PR<br>2. Nota Fiscal do Motor (com dados do proprietário/comprador e do veículo: placa, chassi, etc.)<br>3. Nota Fiscal de Instalação (com dados do proprietário/comprador e do veículo: placa, chassi, etc.)<br><br>⚠️ <strong>Atenção à Potência:</strong><br>O motor novo deve ter potência igual ou diferença máxima de 10% para mais ou para menos.<br><em>**Se a potência do novo motor não ultrapassar os 10%, mas for diferente do original, é obrigatório fazer vistoria no INMETRO.</em>",
        options: [
            { label: "Voltar ao Início", next: "start" }
        ]
    },
    ipva_pr: {
        text: "Para pagamento do IPVA PR, basta pegar o número do Renavam do seu veículo e acessar o site: <br><a href='https://www.contribuinte.fazenda.pr.gov.br/ipva/faces/home' target='_blank'>https://www.contribuinte.fazenda.pr.gov.br/ipva/faces/home</a>",
        options: [
            { label: "Voltar ao Início", next: "start" }
        ]
    }
};

function initChatbot() {
    const chatButton = document.getElementById("chatbot-fab");
    const chatWindow = document.getElementById("chatbot-window");
    const closeButton = document.getElementById("chatbot-close");
    const chatBody = document.getElementById("chatbot-body");

    // Toggle Chat
    function toggleChat() {
        if (chatWindow.style.display === "flex") {
            chatWindow.style.display = "none";
        } else {
            chatWindow.style.display = "flex";
            chatWindow.classList.add("active");
            if (chatBody.children.length === 0) {
                renderNode("start");
            }
        }
    }

    // Render a conversation node
    function renderNode(nodeId) {
        const node = chatbotData[nodeId];

        // Add Bot Message
        const botMsgDiv = document.createElement("div");
        botMsgDiv.className = "chat-message bot";
        botMsgDiv.innerHTML = node.text;
        chatBody.appendChild(botMsgDiv);

        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;

        // Add Options (if any)
        if (node.options) {
            const optionsDiv = document.createElement("div");
            optionsDiv.className = "chat-options";

            node.options.forEach(option => {
                const btn = document.createElement("button");
                btn.className = "chat-option-btn";
                btn.textContent = option.label;
                btn.onclick = () => {
                    // Add User Selection Message
                    const userMsgDiv = document.createElement("div");
                    userMsgDiv.className = "chat-message user";
                    userMsgDiv.textContent = option.label;
                    chatBody.appendChild(userMsgDiv);

                    // Remove old options interactions to prevent double clicking history
                    const oldOptions = document.querySelectorAll(".chat-option-btn");
                    oldOptions.forEach(b => b.disabled = true);
                    optionsDiv.remove(); // Removes the buttons after selection to keep chat clean? 
                    // Actually, let's keep the history clean. 
                    // Better UI pattern: Keep history but disable buttons or just remove them.
                    // Let's remove them for a cleaner look like standard chatbots.

                    // Proceed to next node
                    setTimeout(() => renderNode(option.next), 500);
                };
                optionsDiv.appendChild(btn);
            });
            chatBody.appendChild(optionsDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    chatButton.addEventListener("click", toggleChat);
    closeButton.addEventListener("click", toggleChat);
}

// Auto-run if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
