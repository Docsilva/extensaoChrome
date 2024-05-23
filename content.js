
const crisisTypes = ["Crise A", "Crise B", "Crise C", "Crise D"];
//teste de comentario
// Função para adicionar os estilos CSS ao documento
function addStyles() {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = chrome.runtime.getURL('content.css');
    document.head.appendChild(style);
}

// Função para criar o popup de opções do temporizador
function showTimerOptionsPopup() {
    // Cria o popup
    const popup = document.createElement('div');
    popup.id = 'timer-popup';

    // Estilos do popup
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.zIndex = '1000';
    popup.style.width = '300px';

    // Título do popup
    const title = document.createElement('h3');
    title.textContent = 'Escolha o Tempo do Temporizador';
    popup.appendChild(title);

    // Caixa de seleção para escolher a duração do temporizador
    const selectBox = document.createElement('select');
    const options = ["5 segundos", "5 minutos", "10 minutos", "15 minutos"];
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.text = option;
        selectBox.add(optionElement);
    });
    popup.appendChild(selectBox);

    // Botão para iniciar o temporizador
    const startButton = document.createElement('button');
    startButton.textContent = 'Iniciar';
    startButton.style.marginTop = '10px';
    popup.appendChild(startButton);

    // Adiciona o popup ao corpo do documento
    document.body.appendChild(popup);

    // Evento de clique no botão iniciar
    startButton.addEventListener('click', () => {
        const selectedOption = selectBox.value;
        let timerDuration;
        let durationText;

        switch (selectedOption) {
            case "5 segundos":
                timerDuration = 5000;
                durationText = "5 segundos";
                break;
            case "5 minutos":
                timerDuration = 5 * 60000;
                durationText = "5 minutos";
                break;
            case "10 minutos":
                timerDuration = 10 * 60000;
                durationText = "10 minutos";
                break;
            case "15 minutos":
                timerDuration = 15 * 60000;
                durationText = "15 minutos";
                break;
            default:
                timerDuration = 0;
                durationText = "";
                break;
        }

        if (timerDuration > 0) {
            setTimeout(() => {
                showTimerEndedNotification(durationText);
            }, timerDuration);
        }

        // Remove o popup após a interação
        document.body.removeChild(popup);
    });
}

// Função para criar o popup inicial que pergunta se deseja usar o temporizador
function createInitialPopup() {
    // Adiciona os estilos ao documento
    addStyles();

    // Cria o popup
    const popup = document.createElement('div');
    popup.id = 'initial-popup';

    // Estilos do popup
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.zIndex = '1000';
    popup.style.width = '300px';

    // Título do popup
    const title = document.createElement('h3');
    title.textContent = 'Iniciar Temporizador';
    popup.appendChild(title);

    // Pergunta se o usuário deseja usar o temporizador
    const question = document.createElement('p');
    question.textContent = 'Essa reunião será usada para um incidente Critico?';
    popup.appendChild(question);

    // Botões de resposta
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Sim';
    yesButton.style.marginRight = '10px';
    popup.appendChild(yesButton);

    const noButton = document.createElement('button');
    noButton.textContent = 'Não';
    popup.appendChild(noButton);

    // Adiciona o popup ao corpo do documento
    document.body.appendChild(popup);

    // Evento de clique no botão não
    noButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    // Evento de clique no botão sim
    yesButton.addEventListener('click', () => {
        document.body.removeChild(popup);

        // Criar e adicionar a selectbox de tipos de crise
        const crisisSelectBox = document.createElement('select');
        crisisTypes.forEach(crisis => {
            const optionElement = document.createElement('option');
            optionElement.text = crisis;
            crisisSelectBox.add(optionElement);
        });

        // Criar um novo popup para a selectbox
        const crisisPopup = document.createElement('div');
        crisisPopup.id = 'crisis-popup';

        // Estilos do popup
        crisisPopup.style.position = 'fixed';
        crisisPopup.style.top = '10px';
        crisisPopup.style.right = '10px';
        crisisPopup.style.padding = '20px';
        crisisPopup.style.backgroundColor = 'white';
        crisisPopup.style.border = '1px solid #ccc';
        crisisPopup.style.zIndex = '1000';
        crisisPopup.style.width = '300px';

        // Título do popup
        const crisisTitle = document.createElement('h3');
        crisisTitle.textContent = 'Escolha o Tipo de Crise';
        crisisPopup.appendChild(crisisTitle);

        // Adicionar a selectbox ao novo popup
        crisisPopup.appendChild(crisisSelectBox);

        // Botão para confirmar o tipo de crise
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        confirmButton.style.marginTop = '10px';
        crisisPopup.appendChild(confirmButton);

        // Adicionar o novo popup ao corpo do documento
        document.body.appendChild(crisisPopup);

        // Evento de clique no botão confirmar
        confirmButton.addEventListener('click', () => {
            document.body.removeChild(crisisPopup);
            showTimerOptionsPopup();
        });
    });
}

// Função para exibir uma notificação informando que o tempo do timer acabou
function showTimerEndedNotification(durationText) {
    // Cria o popup de notificação
    const notificationPopup = document.createElement('div');
    notificationPopup.id = 'notification-popup';

    // Estilos do popup de notificação
    notificationPopup.style.position = 'fixed';
    notificationPopup.style.top = '10px';
    notificationPopup.style.right = '10px';
    notificationPopup.style.padding = '20px';
    notificationPopup.style.backgroundColor = 'white';
    notificationPopup.style.border = '1px solid #ccc';
    notificationPopup.style.zIndex = '1001';
    notificationPopup.style.width = '300px';

    // Conteúdo da notificação
    const notificationContent = document.createElement('p');
    notificationContent.textContent = `O tempo do temporizador acabou! (${durationText})`;
    notificationPopup.appendChild(notificationContent);

    // Pergunta ao usuário se deseja iniciar novamente
    const question = document.createElement('p');
    question.textContent = 'Deseja iniciar o temporizador novamente?';
    notificationPopup.appendChild(question);

    // Botões de resposta
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Sim';
    yesButton.style.marginRight = '10px';
    notificationPopup.appendChild(yesButton);

    const noButton = document.createElement('button');
    noButton.textContent = 'Não';
    notificationPopup.appendChild(noButton);

    // Adiciona o popup de notificação ao corpo do documento
    document.body.appendChild(notificationPopup);

    // Evento de clique no botão sim
    yesButton.addEventListener('click', () => {
        document.body.removeChild(notificationPopup);
        showTimerOptionsPopup();
    });

    // Evento de clique no botão não
    noButton.addEventListener('click', () => {
        document.body.removeChild(notificationPopup);
    });
}

// Função para verificar se estamos em uma reunião
function isMeetingActive() {
    // Verifica a presença de elementos específicos de uma reunião
    return !!document.querySelector('[data-self-name]') || !!document.querySelector('[data-meeting-code]');
}

// Função para monitorar as ações do usuário
function monitorUserActions() {
    document.addEventListener('click', (event) => {
        if (event.target.matches("span[jsname='V67aGc']") || event.target.matches("span[jsname='K4r5Ff']")) {
            setTimeout(() => {
                if (isMeetingActive()) {
                    createInitialPopup();
                }
            }, 3000); // Aguarda 3 segundos para garantir que a reunião tenha sido iniciada
        }
    });
}

// Solicita permissão para enviar notificações, caso ainda não tenha sido concedida
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Inicializa a monitoração das ações do usuário
monitorUserActions();
