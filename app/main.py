from fastapi import FastAPI, WebSocket, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Serve static files (CSS/JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates for HTML
templates = Jinja2Templates(directory="templates")

# WebSocket endpoint for keyboard data
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        # Receive keypress data from the frontend
        data = await websocket.receive_text()
        print(f"Received keypress: {data}")

        # Send a response back to the frontend (optional)
        # await websocket.send_text(f"Server received: {data}")

# Serve the HTML page
@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})