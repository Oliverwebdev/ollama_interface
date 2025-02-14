from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # unbedingt importieren!
from pydantic import BaseModel
import requests

app = FastAPI()

# CORS-Konfiguration: Erlaube Anfragen von deinem Frontend (http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Testweise auch ["*"] verwenden
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str

# Basis-URL des Ollama-Servers (Standard: http://127.0.0.1:11434)
OLLAMA_URL = "http://host.docker.internal:11434/api/generate"

@app.post("/ollama")
def query_ollama(query: Query):
    payload = {
        "model": "deepseek-r1:7b",  # Passe hier das gewünschte Modell an
        "prompt": query.question,
        "stream": False  # Für Streaming später auf True setzen
    }
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return response.json()
