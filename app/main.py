from fastapi import FastAPI, WebSocket, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import asyncio

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

data = 0
gamepad_clients = set()

# WebSocket endpoint for gamepad data
@app.websocket("/ws/gamepad")
async def gamepad_websocket(websocket: WebSocket):
    await websocket.accept()
    gamepad_clients.add(websocket)
    try:
        while True:
            # Receive gamepad data from the client
            data = await websocket.receive_json()
            await broadcast_to_gamepad(data)
            print(f"Gamepad Data: {data}")  # Process this data as needed
            # await websocket.send_json({"axes": [0.0, 0.0], "buttons": [0, 0]})
            # await asyncio.sleep(0.1)  # 100ms interval
            
    except Exception as e:
        print(f"Error in GamepadROS WebSocket: {e}")
    finally:
        gamepad_clients.remove(websocket)
        await websocket.close()

    # while True:
    # Example: Send dummy data every 100ms
        # await websocket.send_json({"axes": [0.0, 0.0], "buttons": [0, 0]})
        # await asyncio.sleep(0.1)  # 100ms interval

# Broadcast data to all connected GamepadROS clients
async def broadcast_to_gamepad(data):
    if gamepad_clients:
        for client in gamepad_clients:
            try:
                await client.send_json(data)
                print(f"Forwarded data to Gamepad client: {data}")
            except Exception as e:
                print(f"Error sending data to Gamepad client: {e}")


# Serve HTML page
@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
    