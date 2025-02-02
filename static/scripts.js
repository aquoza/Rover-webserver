// Connect to WebSocket
const ws = new WebSocket('ws://' + window.location.host + '/ws');
const keypressDisplay = document.getElementById('keypress-display');

// Handle WebSocket connection
ws.onopen = () => {
    console.log('WebSocket connection established');
};

// Handle incoming messages from the server
ws.onmessage = (event) => {
    keypressDisplay.textContent = `Server response: ${event.data}`;
};

// Handle virtual keyboard clicks
const virtualKeyboard = document.getElementById('virtual-keyboard');
virtualKeyboard.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const key = event.target.getAttribute('data-key'); // Get the key from the button
        keypressDisplay.textContent = `Key pressed: ${key}`;

        // Send the keypress data to the server
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(key);
        }
    }
});