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


const ws = new WebSocket('ws://192.168.0.100:8000/ws/laptop');

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
    intervalId = setInterval(pollGamepad, 50);
    setInterval(updateGamepad, 50);
});

// Gamepad disconnection handler
window.addEventListener('gamepaddisconnected', (e) => {
    document.getElementById('gamepad-status').textContent = 
        'Gamepad Disconnected';
    document.getElementById('gamepad-status').style.backgroundColor = "#FB8773";
    gamepadIndex = null;
    clearInterval(intervalId); // Stop the interval
});

// Initial states
let roverState = 'Ackermann'; // Can be 'Ackerman' or 'On-spot'
let armState = 'Node0';
let nodeValue = 0;
let flag = 0;
let button0Pressed = false;
let button1Pressed = false;
let button2Pressed = false;
let button3Pressed = false;

// Get the div element
const modeValueDiv = document.querySelector('.mode_value');

function updateGamepad() {
    // Get the first gamepad
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];
    
    if (!gamepad) return;

    // Button 0 - Toggle between Rover:Ackerman and Rover:On-spot
    if (gamepad.buttons[1].pressed) {
        if (!button0Pressed) {
            roverState = roverState === 'Ackermann' ? 'On-spot' : 'Ackermann';
            modeValueDiv.textContent = `Rover:${roverState}`;
            button0Pressed = true;
        }
    } else {
        button0Pressed = false;
    }

    // Button 1 - Set to Arm:Node0
    if (gamepad.buttons[3].pressed) {
        if (!button1Pressed && flag == 1) {
            armState = 'Node0';
            nodeValue = 0;
            modeValueDiv.textContent = `Arm:${armState}`;
            button1Pressed = true;
            flag = 0;
        }
        else if (!button1Pressed && flag == 0){
            armState = 'Node0';
            nodeValue = 0;
            modeValueDiv.textContent = `Rover:${roverState}`;
            button1Pressed = true;
            flag = 1;
        }
    
    } else {
        button1Pressed = false;
    }

    // Button 2 - Increment node value (max 2)
    if (gamepad.buttons[5].pressed) {
        if (!button2Pressed) {
            if (nodeValue < 2) {
                nodeValue++;
                armState = `Node${nodeValue}`;
                modeValueDiv.textContent = `Arm:${armState}`;
            }
            button2Pressed = true;
        }
    } else {
        button2Pressed = false;
    }

    // Button 3 - Decrement node value (min 0)
    if (gamepad.buttons[4].pressed) {
        if (!button3Pressed) {
            if (nodeValue > 0) {
                nodeValue--;
                armState = `Node${nodeValue}`;
                modeValueDiv.textContent = `Arm:${armState}`;
            }
            button3Pressed = true;
        }
    } else {
        button3Pressed = false;
    }
}

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

const video = document.getElementById('webcam');
        
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error("Could not access the webcam: ", error);
        });
        document.getElementById('drone-status').textContent = `Drone Connected`;
        document.getElementById('drone-status').style.backgroundColor = "#b8f592";
} else {
    alert("Your browser doesn't support accessing the webcam.");
}

// WebSocket connection handlers
ws.onopen = () => {
    console.log('WebSocket connection established');
    console.log('hi');
};