const toggleButton = document.getElementById('toggleButton');
const addAlarmButton = document.getElementById('addAlarm');
const dialog = document.getElementById('dialog');
const closeDialog = document.querySelector('.close');
const setSoundButton = document.getElementById('setSound');
const alarmList = document.getElementById('alarmList');
let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
const alarmAudio = document.getElementById('alarmAudio');


const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
let audioContext;

toggleButton.addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
    }
    alarmAudio.play();
});

function init() {
    renderAlarms();
}

addAlarmButton.addEventListener('click', () => {
    dialog.style.display = 'block';
});

closeDialog.addEventListener('click', () => {
    dialog.style.display = 'none';
});

setSoundButton.addEventListener('click', () => {
    const timeInput = document.getElementById('time').value;
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    const selectedDays = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => Number(checkbox.value));
    
    if (timeInput && selectedDays.length > 0) {
        const alarm = { time: timeInput, days: selectedDays };
        alarms.push(alarm);
        localStorage.setItem('alarms', JSON.stringify(alarms));
        alert(`Sonido programado para ${timeInput} en días seleccionados.`);
        dialog.style.display = 'none';
        renderAlarms();
    }
});

function renderAlarms() {
    alarmList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const alarmDays = alarm.days.map(day => daysOfWeek[day]).join(', ');
        const alarmItem = document.createElement('div');
        alarmItem.className = 'alarm-item';
        alarmItem.innerHTML = `
            <span>${alarm.time} - Días: ${alarmDays}</span>
            <button class="delete-button" onclick="deleteAlarm(${index})">Eliminar</button>
        `;
        alarmList.appendChild(alarmItem);
    });
}

function deleteAlarm(index) {
    alarms.splice(index, 1);
    localStorage.setItem('alarms', JSON.stringify(alarms));
    renderAlarms();
}

setInterval(checkAlarms, 1000);

function checkAlarms() {
    const now = new Date();
    const currentDay = now.getDay(); 
    const currentTime = now.toTimeString().slice(0, 5); 

    alarms.forEach(alarm => {
        if (alarm.time === currentTime && alarm.days.includes(currentDay - 1)) {
            alarmAudio.play(); 
            new Notification("Alarma", { body: "¡Es hora de la alarma!" });

            if (navigator.serviceWorker) {
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification("Alarma", {
                        body: "¡Es hora de la alarma!",
                        icon: 'icon.png' 
                    });
                });
            }
        }
    });
}

if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

init();
