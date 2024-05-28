// content.js
const crisisTypes = ["Crise A", "Crise B", "Crise C", "Crise D"];
let selectedCrisisType = "";  // Variável para armazenar o tipo de crise selecionado

// Função para adicionar os estilos CSS ao documento
function addStyles() {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = chrome.runtime.getURL('content.css');
    document.head.appendChild(style);
}

// Função para criar o popup de opções do temporizador
function showTimerOptionsPopup() {
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

    const title = document.createElement('h3');
    title.textContent = 'Escolha o Tempo do Temporizador';
    popup.appendChild(title);

    const selectBox = document.createElement('select');
    const options = ["5 segundos", "5 minutos", "10 minutos", "15 minutos"];
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.text = option;
        selectBox.add(optionElement);
    });
    popup.appendChild(selectBox);

    const startButton = document.createElement('button');
    startButton.textContent = 'Iniciar';
    startButton.style.marginTop = '10px';
    popup.appendChild(startButton);

    document.body.appendChild(popup);

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

        document.body.removeChild(popup);
    });
}

// Função para criar o popup inicial que pergunta se deseja usar o temporizador
function createInitialPopup() {
    addStyles();

    const popup = document.createElement('div');
    popup.id = 'initial-popup';

    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.zIndex = '1000';
    popup.style.width = '300px';

    const title = document.createElement('h3');
    title.textContent = 'Iniciar Temporizador';
    popup.appendChild(title);

    const question = document.createElement('p');
    question.textContent = 'Essa reunião será usada para um incidente Critico?';
    popup.appendChild(question);

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Sim';
    yesButton.style.marginRight = '10px';
    popup.appendChild(yesButton);

    const noButton = document.createElement('button');
    noButton.textContent = 'Não';
    popup.appendChild(noButton);

    document.body.appendChild(popup);

    noButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    yesButton.addEventListener('click', () => {
        document.body.removeChild(popup);

        const crisisSelectBox = document.createElement('select');
        crisisTypes.forEach(crisis => {
            const optionElement = document.createElement('option');
            optionElement.text = crisis;
            crisisSelectBox.add(optionElement);
        });

        const crisisPopup = document.createElement('div');
        crisisPopup.id = 'crisis-popup';

        crisisPopup.style.position = 'fixed';
        crisisPopup.style.top = '10px';
        crisisPopup.style.right = '10px';
        crisisPopup.style.padding = '20px';
        crisisPopup.style.backgroundColor = 'white';
        crisisPopup.style.border = '1px solid #ccc';
        crisisPopup.style.zIndex = '1000';
        crisisPopup.style.width = '300px';

        const crisisTitle = document.createElement('h3');
        crisisTitle.textContent = 'Escolha o Tipo de Crise';
        crisisPopup.appendChild(crisisTitle);

        crisisPopup.appendChild(crisisSelectBox);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        confirmButton.style.marginTop = '10px';
        crisisPopup.appendChild(confirmButton);

        document.body.appendChild(crisisPopup);

        confirmButton.addEventListener('click', () => {
            selectedCrisisType = crisisSelectBox.value;  // Armazena o tipo de crise selecionado
            document.body.removeChild(crisisPopup);
            showTimerOptionsPopup();
        });
    });
}

// Função para exibir uma notificação informando que o tempo do timer acabou
function showTimerEndedNotification(durationText) {
    const notificationPopup = document.createElement('div');
    notificationPopup.id = 'notification-popup';

    notificationPopup.style.position = 'fixed';
    notificationPopup.style.top = '10px';
    notificationPopup.style.right = '10px';
    notificationPopup.style.padding = '20px';
    notificationPopup.style.backgroundColor = 'white';
    notificationPopup.style.border = '1px solid #ccc';
    notificationPopup.style.zIndex = '1001';
    notificationPopup.style.width = '300px';

    const notificationContent = document.createElement('p');
    notificationContent.textContent = `O tempo do temporizador acabou! (${durationText}). Tipo de Crise: ${selectedCrisisType}`;
    notificationPopup.appendChild(notificationContent);

    const question = document.createElement('p');
    question.textContent = 'Deseja iniciar o temporizador novamente?';
    notificationPopup.appendChild(question);

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Sim';
    yesButton.style.marginRight = '10px';
    notificationPopup.appendChild(yesButton);

    const noButton = document.createElement('button');
    noButton.textContent = 'Não';
    notificationPopup.appendChild(noButton);

    document.body.appendChild(notificationPopup);

    yesButton.addEventListener('click', () => {
        document.body.removeChild(notificationPopup);
        showTimerOptionsPopup();
    });

    noButton.addEventListener('click', () => {
        document.body.removeChild(notificationPopup);
    });
}

// Função para verificar se estamos em uma reunião
function isMeetingActive() {
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

if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

monitorUserActions();
