from fastapi import FastAPI

app = FastAPI()


@app.get("/open")
def open():
    return

@app.get("/close")
def close():
    return