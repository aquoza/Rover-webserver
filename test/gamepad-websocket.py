from fastapi import WebSocket


async def gamepad_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive gamepad data from the client
            data = await websocket.receive_json()
            print(f"Gamepad Data: {data}")  # Process this data as needed
            
            # Optional: Send acknowledgment back
            # await websocket.send_json({"status": "received"})
    except Exception as e:
        print(f"WebSocket error: {e}")

while True:
    gamepad_websocket()
