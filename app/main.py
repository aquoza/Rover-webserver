from fastapi import FastAPI, WebSocket, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# WebSocket endpoint for gamepad data
@app.websocket("/ws/gamepad")
async def gamepad_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive gamepad data from the client
            data = await websocket.receive_json()
            # print(f"Gamepad Data: {data}")  # Process this data as needed
            
            # Optional: Send acknowledgment back
            await websocket.send_json({"status": "received"})
    except Exception as e:
        print(f"WebSocket error: {e}")

# Serve HTML page
@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})