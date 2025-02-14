from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import logging
import shutil
import os

app = FastAPI()

# Logging einrichten
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS-Konfiguration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str
    model: str = "deepseek-r1:7b"  # Modell dynamisch anpassbar

# Basis-URL des Ollama-Servers
OLLAMA_URL = "http://host.docker.internal:11434/api/generate"
UPLOAD_FOLDER = "uploaded_files"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/ollama")
def query_ollama(query: Query):
    payload = {
        "model": query.model,  # Dynamische Modellwahl
        "prompt": query.question,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP-Fehler: {response.status_code}, {response.text}")
        raise HTTPException(status_code=response.status_code, detail=f"HTTP-Fehler: {response.text}")
    except requests.exceptions.ConnectionError:
        logger.error("Verbindung zum Ollama-Server fehlgeschlagen.")
        raise HTTPException(status_code=500, detail="Verbindung zum Ollama-Server fehlgeschlagen.")
    except requests.exceptions.Timeout:
        logger.error("Timeout bei der Anfrage.")
        raise HTTPException(status_code=504, detail="Timeout bei der Anfrage.")
    except Exception as e:
        logger.error(f"Allgemeiner Fehler: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Fehler: {str(e)}")

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    logger.info(f"Datei hochgeladen: {file.filename}")
    return {"filename": file.filename, "message": "Datei erfolgreich hochgeladen"}
