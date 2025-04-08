from fastapi import FastAPI, WebSocket, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager
import asyncio
import cv2

data = 0
ws_clients = {}

# Camera IP
cam1_IP = "192.168.0.101:554"
# RTSP stream URL
RTSP_URL = f"rtsp://admin:L206FE20@{cam1_IP}/cam/realmonitor?channel=1&subtype=0&proto=Onvif"
# Global variable to signal shutdown
shutdown_event = asyncio.Event()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize resources (if needed)
    yield
    # Clean up resources on shutdown
    shutdown_event.set()

app = FastAPI(lifespan=lifespan)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.websocket("/ws/laptop")
async def gamepad_websocket(websocket: WebSocket):
    await websocket.accept()
    ws_clients['laptop'] = websocket
    print(f"Client laptop is connected")
    try:
        while True:
            data = await websocket.receive_json() 
            if 'ros' in ws_clients :
                await ws_clients['ros'].send_json(data)
            # print(data)  # Process this data as needed
            
    except Exception as e:
        print(f"Error in laptop WebSocket: {e}")
    finally:
        ws_clients.pop('laptop')
        await websocket.close()

@app.websocket("/ws/ros")
async def gamepad_websocket(websocket: WebSocket):
    await websocket.accept()
    ws_clients['ros'] = websocket
    print(f"Client ros is connected")
    try:
        while True:
            await ws_clients['ros'].receive_text()
            # await ws_clients["ros"].send_text('hello')
            # await asyncio.sleep(1)
    except Exception as e:
        print(f"Error in ros WebSocket: {e}")
    finally:
        await websocket.close()
        ws_clients.pop('ros')

# Global variable to store the latest frame
latest_frame = None
frame_lock = asyncio.Lock()

@app.websocket("/ws/thermal")
async def websocket_receiver(websocket: WebSocket):
    global latest_frame
    await websocket.accept()
    print("WebSocket connected")
    
    try:
        while True:
            # Receive binary data (JPEG image) from WebSocket
            data = await websocket.receive_bytes()
            print(data)
            
            # Update the latest frame with thread-safe locking
            async with frame_lock:
                latest_frame = data
                
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        async with frame_lock:
            latest_frame = None

async def generate_frames():
    global latest_frame
    while True:
        async with frame_lock:
            if latest_frame is not None:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + 
                       latest_frame + b'\r\n')
        
        # Small delay to prevent busy waiting
        await asyncio.sleep(0.01)

@app.get("/thermal")
async def thermal_stream():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

# Serve HTML page
@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

    