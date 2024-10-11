function createRecordingReminderPopup() {
    createPopupReminder('Atenção', 'NÃO ESQUEÇA DE INICIAR A GRAVAÇÃO DA WAR ROOM!!!!', [
        { text: 'OK', callback: closeReminderPopup }
    ]);
}

function createPopupReminder(title, content, buttons) {
    const popup = document.createElement('div');
    popup.classList.add('popup-reminder'); 

    const titleElem = document.createElement('h3');
    titleElem.textContent = title;
    popup.appendChild(titleElem);

    const contentElem = document.createElement('p');
    contentElem.textContent = content;
    popup.appendChild(contentElem);

    buttons.forEach(({ text, callback }) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('button');
        button.onclick = () => {
            callback(popup); // Passa o popup para a função de callback para ser fechado
        };
        popup.appendChild(button);
    });

    document.body.appendChild(popup);
    return popup;
}

function closeReminderPopup(popup) {
    // Função para remover o popup de lembrete
    popup.remove(); // Remove o popup do DOM
}


const crisisTypes = ["SITES P1", "SITES P2/P3"];

// Tempos em minutos

const timersP1 = [
    { duration: 300 , message: "NATIS N2 / NATIS NOC" },
    { duration: 600, message: "Net N2 y N3, NATS N2 / PLs (Net e NATIS) / IS Ops Analista" },
    { duration: 1800, message: "Network TLS / IS OPS Leaders" },
    { duration: 2400, message: "Managers Infra / Sustentação e NATIS Manager" }
];
const timersP2P3 = [
    { duration: 300, message: "NATIS N2 / NATIS NOC" },
    { duration: 600, message: "Net N1, NATS N2 / NATIS PLS / IS Ops Analistas" },
    { duration: 1500, message: "Network N2" },
    { duration: 2400, message: "Network N3 / Net PLs / IS OPS Leaders" },
    { duration: 3300, message: "NATIS Manager / Network TLs" },
    { duration: 4200, message: "Managers e Infra / Sustentação" }
];

// Tempos em segundos
/*
const timersP1 = [
    { duration: 5 , message: "NATIS N2 / NATIS NOC" },
    { duration: 5, message: "Net N2 y N3, NATS N2 / PLs (Net e NATIS) / IS Ops Analista" },
    { duration: 5, message: "Network TLS / IS OPS Leaders" },
    { duration: 5, message: "Managers Infra / Sustentação e NATIS Manager" }
];
const timersP2P3 = [
    { duration: 5, message: "NATIS N2 / NATIS NOC" },
    { duration: 8, message: "Net N1, NATS N2 / NATIS PLS / IS Ops Analistas" },
    { duration: 10, message: "Network N2" },
    { duration: 12, message: "Network N3 / Net PLs / IS OPS Leaders" },
    { duration: 14, message: "NATIS Manager / Network TLs" },
    { duration: 15, message: "Managers e Infra / Sustentação" }
];
*/

let currentIndex = 0;
let selectedTimers = null;
let timerInterval = null;
let isPaused = false;
let remainingTime = 0;

function resetPopups() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.remove());

    currentIndex = 0;
    selectedTimers = null;
    clearInterval(timerInterval);
    isPaused = false;
    remainingTime = 0;
}

function createPopup(title, content, buttons) {
    const popup = document.createElement('div');
    popup.classList.add('popup', 'popup-center');

    const titleElem = document.createElement('h3');
    titleElem.textContent = title;
    popup.appendChild(titleElem);

    const contentElem = document.createElement('p');
    contentElem.textContent = content;
    popup.appendChild(contentElem);

    buttons.forEach(({ text, callback }) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('button');
        button.onclick = callback;
        popup.appendChild(button);
    });

    document.body.appendChild(popup);
    return popup;
}

function createInitialPopup() {
    const yesButtonCallback = () => {
        resetPopups();
        createCrisisTypePopup();
        monitorJoinAndStartRecording();
    };
    const noButtonCallback = () => {
        resetPopups();
        enableExtensionIcon();
    };
    createPopup('Essa reunião será usada para um incidente Crítico?', '', [
        { text: 'Sim', callback: yesButtonCallback },
        { text: 'Não', callback: noButtonCallback }
    ]);
}

function monitorJoinAndStartRecording() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Verifica se o usuário entrou na reunião
                if (isMeetingActive()) {
                    observer.disconnect();
                    startRecording();
                    break;
                }
            }
        }
    });

    observer.observe(targetNode, config);
}

function createCrisisTypePopup() {
    const popup = createPopup('Escolha o Tipo de Crise', '', []);
    
    const select = document.createElement('select');
    select.classList.add('select');
    crisisTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
    });
    popup.appendChild(select);

    const confirmButtonCallback = () => {
        const selectedCrisis = select.value;
        popup.style.display = 'none';
        selectedTimers = selectedCrisis === 'SITES P1' ? timersP1 : timersP2P3;
        createRecordingReminderPopup();
        showTimerOptionsPopup(selectedTimers);
    };
    
    popup.appendChild(createButton('Confirmar', confirmButtonCallback));
}

function createButton(buttonText, callback) {
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.classList.add('button');
    button.onclick = callback;
    return button;
}

function showTimerOptionsPopup(timers) {
    currentIndex = 0;

    const popup = createPopup('Lista de Temporizadores e Equipes', '', []);
    const list = document.createElement('ul');
    list.classList.add('crisis-list');
    timers.forEach(timer => {
        const listItem = document.createElement('li');
        listItem.classList.add('crisis-item');
        listItem.textContent = `${formatTime(timer.duration)} - ${timer.message}`;
        list.appendChild(listItem);
    });
    popup.appendChild(list);

    const startButtonCallback = () => {
        popup.style.display = 'none';
        startTimers(timers, currentIndex);
    };

    const startButton = createButton('Iniciar', startButtonCallback);
    startButton.classList.add('start-button');
    popup.appendChild(startButton);
}

function formatTime(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function createOrUpdateTimerDisplay(duration) {
    let timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) {
        timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';

        const timerText = document.createElement('p');
        timerText.id = 'timer-text';
        timerText.textContent = `Tempo restante: ${formatTime(duration)}`;
        timerDisplay.appendChild(timerText);
        
        const pauseButton = createButton('Pausar', togglePause);
        pauseButton.id = 'pause-button';
        timerDisplay.appendChild(pauseButton);

        const interruptButton = createButton('✖', showInterruptConfirmation);
        interruptButton.id = 'interrupt-button';
        timerDisplay.appendChild(interruptButton);
        
        // Botão "Pular" apenas se estivermos no primeiro temporizador (currentIndex === 0)
        if (currentIndex === 0) {
            const skipButton = createButton('Pular', skipFirstTimer);
            skipButton.id = 'skip-button';
            timerDisplay.appendChild(skipButton);
        }

        document.body.appendChild(timerDisplay);

        // Tornar o popup de temporizador arrastável
        makeElementDraggable(timerDisplay);
    } else {
        const timerText = document.getElementById('timer-text');
        timerText.textContent = `Tempo restante: ${formatTime(duration)}`;
        
        const skipButton = document.getElementById('skip-button');
        if (skipButton && currentIndex > 0) {
            if (skipButton) {
                if (currentIndex === 0) {
                    // Reativa o botão pular se estivermos no primeiro temporizador
                    skipButton.disabled = false;
                    skipButton.style.backgroundColor = '';  // Restaura a cor original
                    skipButton.style.cursor = 'pointer';  // Restaura o cursor para o padrão
                } else {
                    // Se não for o primeiro temporizador, desativa o botão
            skipButton.disabled = true;
            skipButton.style.backgroundColor = '#d3d3d3'; // Indica desativado
            skipButton.style.cursor = 'not-allowed';
                }
            }
        }
    }
    return timerDisplay;
}

function skipFirstTimer() {
    // Para o temporizador atual
    clearInterval(timerInterval);

    // Exibe uma mensagem informando que o primeiro nível foi pulado
    createTemporaryPopup('Temporizador Pulado', 'Você pulou o primeiro nível.');

    // Incrementa o índice para o segundo temporizador
    currentIndex = 1;

    // Desativa o botão "Pular" após ser clicado
    const skipButton = document.getElementById('skip-button');
    if (skipButton) {
        skipButton.disabled = true;  // Desativa o botão
        skipButton.style.backgroundColor = '#d3d3d3';  // Opcional: Muda a cor para indicar que está desativado
        skipButton.style.cursor = 'not-allowed';  // Opcional: Muda o cursor para indicar que o botão está desativado
    }

    // Inicia o segundo temporizador imediatamente
    startTimers(selectedTimers, currentIndex);
}


function showInterruptConfirmation() {
    const wasPausedBefore = isPaused;


    pauseTimer(); // Pausa o temporizador ao abrir a confirmação

    // Desabilita o botão de pausa enquanto o popup de confirmação está ativo
    const pauseButton = document.getElementById('pause-button');
    if (pauseButton) {
        pauseButton.disabled = true;
        pauseButton.style.backgroundColor = '#d3d3d3'; // Cor cinza clara ou escolha outra cor para indicar inatividade
    }

    const confirmationPopup = createPopup(
        'Confirmar Interrupção',
        'Tem certeza que deseja interromper o temporizador?',
        [
            {
                text: 'Sim',
                callback: () => {
                    resetPopups();
                    showInterruptionNotification();
                    // Reativa o botão de pausa e restaura a cor original
                    if (pauseButton) {
                        pauseButton.disabled = false;
                        pauseButton.style.backgroundColor = ''; // Remove a cor inativa, restaurando a cor original
                    }
                }
            },
            {
                text: 'Não',
                callback: () => {
                    confirmationPopup.style.display = 'none';
                    // Se o temporizador não estava pausado antes, retoma o temporizador
                    if (!wasPausedBefore) {
                        resumeTimer();
                    }
                    // Reativa o botão de pausa e restaura a cor original
                    if (pauseButton) {
                        pauseButton.disabled = false;
                        pauseButton.style.backgroundColor = ''; // Remove a cor inativa, restaurando a cor original
                    }
                }
            }
        ]
    );
}

function interruptTimer() {
    resetPopups();
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.style.display = 'none';
    }
    const interruptPopup = createPopup('Temporizador Interrompido', 'O temporizador foi interrompido.', []);
    setTimeout(() => {
        interruptPopup.style.display = 'none';
    }, 2000); // Usando o mesmo tempo que o popup de todos os temporizadores acabaram.
    enableExtensionIcon();
}

function showInterruptionNotification() {
    createTemporaryPopup('Temporizador Interrompido', 'O temporizador foi interrompido com sucesso.');
    // Não retoma o temporizador nem exibe outros popups
}

function resetPopups() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.remove());

    currentIndex = 0;
    selectedTimers = null;
    clearInterval(timerInterval);
    isPaused = false;
    remainingTime = 0;

    // Adiciona uma verificação para garantir que nenhum temporizador continue correndo
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.style.display = 'none';
    }
}

function togglePause() {
    const pauseButton = document.getElementById('pause-button');
    if (!isPaused) {
        pauseTimer();
        pauseButton.textContent = 'Retomar';
    } else {
        resumeTimer();
        pauseButton.textContent = 'Pausar';
    }
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timerInterval);
}

function resumeTimer() {
    isPaused = false;
    startTimers(selectedTimers, currentIndex, remainingTime);
}

function startTimers(timers, index, resumeTime = null) {
    if (index < timers.length) {
        remainingTime = resumeTime !== null ? resumeTime : timers[index].duration;

        const timerDisplay = createOrUpdateTimerDisplay(remainingTime);
        timerDisplay.style.display = 'block';

        timerInterval = setInterval(() => {
            if (!isPaused) {
                remainingTime--;
                const timerText = document.getElementById('timer-text');
                timerText.textContent = `Tempo restante: ${formatTime(remainingTime)}`;

                if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                    timerDisplay.style.display = 'none';
                    showTimerEndedNotification(index, timers);
                    showTeamNotification(index, timers);
                    currentIndex++;
                    if (currentIndex < timers.length) {
                        setTimeout(() => startTimers(timers, currentIndex), 2000);
                    } else {
                        setTimeout(() => showAllTeamsCalledNotification(), 3000);
                    }
                }
            }
        }, 1000);
    }
}

function showTimerEndedNotification(index, timers) {
    const notification = new Notification("Temporizador Finalizado", {
        body: `Temporizador finalizado: ${timers[index].message}`,
    });

    notification.onclick = () => {
        notification.close();
    };
}

function showTeamNotification(index, timers) {
    const notificationContent = `Acione a equipe: ${timers[index].message}.`;
    createTemporaryPopup(`${index + 1}º Temporizador Acabou`, notificationContent);
}

function showAllTeamsCalledNotification() {
    createTemporaryPopup('Todos os temporizadores acabaram', 'Todas as equipes foram acionadas.');
}

function createTemporaryPopup(title, content) {
    const notificationPopup = createPopup(title, content, []);
    notificationPopup.style.zIndex = '1001';
    setTimeout(() => {
        notificationPopup.style.display = 'none';
    }, 8000);
}

function requestNotificationPermission() {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            }
        });
    }
}

function monitorJoinNowButton() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const joinButton = document.querySelector('button[jsname="Qx7uuf"]');
                if (joinButton) {
                    observer.disconnect();
                    createInitialPopup();
                    break;
                }
            }
        }
    });

    observer.observe(targetNode, config);
}

function isMeetingActive() {
    return !!document.querySelector('[data-self-name]') || !!document.querySelector('[data-meeting-code]');
}

function enableExtensionIcon() {
    // Certifique-se de que este código rodará em um contexto onde `chrome` está definido.
    chrome.runtime.sendMessage({ action: "enableIcon" });
}

// Verifique se você está em um ambiente onde `chrome` e `Notification` são suportados.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openPopup") {
        createInitialPopup();
    }
});

// Função para tornar o elemento arrastável
function makeElementDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Pega a posição inicial do cursor do mouse
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Chama a função quando o cursor se move
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calcula a nova posição do cursor
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Define a nova posição do popup
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Para de mover o popup quando o mouse é solto
        document.onmouseup = null;
        document.onmousemove = null;
    }
}



requestNotificationPermission();
monitorJoinNowButton();