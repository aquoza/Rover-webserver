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
        print('here1')
        await websocket.close()
        print('here2')
        ws_clients.pop('ros')

# async def generate_frames(request: Request):
#     # Open the RTSP stream
#     cap = cv2.VideoCapture(RTSP_URL)
#     if not cap.isOpened():
#         raise Exception("Error: Could not open RTSP stream.")

#     try:
#         while not shutdown_event.is_set():
#             # Check if the client is still connected
#             if await request.is_disconnected():
#                 print("Client disconnected.")
#                 break

#             ret, frame = cap.read()
#             if not ret:
#                 print("Error: Failed to read frame.")
#                 break

#             # Encode the frame as JPEG
#             _, buffer = cv2.imencode('.jpg', frame)
#             frame_bytes = buffer.tobytes()

#             # Yield the frame in MJPEG format
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

#             # Add a small delay to control the frame rate
#     finally:
#         # Release the VideoCapture object
#         cap.release()
#         print("RTSP stream released.")

# @app.get("/video_feed")
# async def video_feed(request: Request):
#     return StreamingResponse(
#         generate_frames(request),
#         media_type="multipart/x-mixed-replace; boundary=frame"
#     )

# Serve HTML page
@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

    