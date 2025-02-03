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

// const ws = new WebSocket('ws://YOUR_RPI_IP:8000/ws/gamepad');
// let gamepadIndex = null;
// let isRunning = false;

// // Gamepad connection handler
// window.addEventListener('gamepadconnected', (e) => {
//     gamepadIndex = e.gamepad.index;
//     document.getElementById('gamepad-status').textContent = 
//         `Gamepad Connected: ${e.gamepad.id}`;
//     if (!isRunning) pollGamepad();
// });

// // Gamepad disconnection handler
// window.addEventListener('gamepaddisconnected', (e) => {
//     document.getElementById('gamepad-status').textContent = 
//         'Gamepad Disconnected';
//     gamepadIndex = null;
//     isRunning = false;
// });

// // Gamepad polling loop
// function pollGamepad() {
//     isRunning = true;
//     const gamepad = navigator.getGamepads()[gamepadIndex];
    
//     if (gamepad && ws.readyState === WebSocket.OPEN) {
//         // Prepare gamepad data
//         const data = {
//             axes: Array.from(gamepad.axes),
//             buttons: Array.from(gamepad.buttons).map(b => b.value),
//             timestamp: Date.now()
//         };
        
//         // Send via WebSocket
//         ws.send(JSON.stringify(data));
//     }
    
//     // Continue polling
//     if (isRunning) requestAnimationFrame(pollGamepad);
// }

// // WebSocket connection handlers
// ws.onopen = () => {
//     console.log('WebSocket connection established');
// };