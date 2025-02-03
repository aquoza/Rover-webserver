document.addEventListener("DOMContentLoaded",initTabs);

function initTabs(){
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content")

    tabs.forEach(function(tab){
        tab.addEventListener("click", function (){
            const content = document.getElementById(this.dataset.tab);
            tabs.forEach(tab => tab.classList.remove('active'));

            contents.forEach(content=>content.classList.remove('active'));

            content.classList.add("active");
            this.classList.add("active");

        });
    });
}

const ws = new WebSocket('ws://atvpi.local:8000/ws/gamepad');
let gamepadIndex = null;
let intervalId = null;

// Gamepad connection handler
window.addEventListener('gamepadconnected', (e) => {
    gamepadIndex = e.gamepad.index;
    document.getElementById('gamepad-status').textContent = 
        `Gamepad Connected`;
    document.getElementById('gamepad-status').style.backgroundColor = "#b8f592";
    intervalId = setInterval(pollGamepad, 100);
});

// Gamepad disconnection handler
window.addEventListener('gamepaddisconnected', (e) => {
    document.getElementById('gamepad-status').textContent = 
        'Gamepad Disconnected';
    document.getElementById('gamepad-status').style.backgroundColor = "#FB8773";
    gamepadIndex = null;
    clearInterval(intervalId); // Stop the interval
});

// Gamepad polling loop
function pollGamepad() {
    isRunning = true;
    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (!gamepad) return;
    
    if (gamepad && ws.readyState === WebSocket.OPEN) {
        // Prepare gamepad data
        const data = {
            axes: Array.from(gamepad.axes),
            buttons: Array.from(gamepad.buttons).map(b => b.value),
            timestamp: Date.now()
        };
        
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }
    
}

// WebSocket connection handlers
ws.onopen = () => {
    console.log('WebSocket connection established');
};