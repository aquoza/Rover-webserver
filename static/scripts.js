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

const ip = '0.0.0.0:8000'

const ws = new WebSocket('ws://'+ ip +'/ws/laptop');

let gamepadIndex = null;
let intervalId = null;

// Gamepad connection handler
window.addEventListener('gamepadconnected', (e) => {
    gamepadIndex = e.gamepad.index;
    document.getElementById('gamepad-status').textContent = 
        `Gamepad Connected`;
    document.getElementById('gamepad-status').style.backgroundColor = "#b8f592";
    // if (ws.readyState === WebSocket.OPEN) {
    //     ws.send(ws.send(JSON.stringify({"ID":"laptop"})));
    // }
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

// // Get the image element and status div
// const thermalImg = document.querySelector('img[src="http://0.0.0.0:8000/thermal"]');
// const thermalStatus = document.getElementById('thermal-status');

// if (thermalImg && thermalStatus) {
//     // Add event listeners for load and error events
//     thermalImg.addEventListener('load', function() {
//         thermalStatus.textContent = 'Thermal camera Connected';
//         thermalStatus.style.backgroundColor = '#b8f592'; // Reset to default or your connected color
//     });

//     thermalImg.addEventListener('error', function() {
//         thermalStatus.textContent = 'Thermal camera Not Connected';
//         thermalStatus.style.backgroundColor = '#FB8773';
//     });

//     // Check immediately in case the image is already loaded or errored
//     if (thermalImg.complete) {
//         if (thermalImg.naturalHeight === 0) {
//             // Image error
//             thermalStatus.textContent = 'Thermal camera Not Connected';
//             thermalStatus.style.backgroundColor = '#FB8773';
//         }
//     }
// } else {
//     console.error('Either thermal image or status element not found');
// }

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
    console.log('hi');
};