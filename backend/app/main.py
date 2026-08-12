from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Rentify API is running"}