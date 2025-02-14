from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import logging
import os
import fitz  # PyMuPDF für PDFs
import pytesseract  # Tesseract OCR für Bilder
from PIL import Image
import base64

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
    model: str = "deepseek-r1:7b"

OLLAMA_URL = "http://host.docker.internal:11434/api/generate"

def extract_text_from_pdf(pdf_bytes):
    """Extrahiert Text aus einer PDF-Datei."""
    text = ""
    try:
        doc = fitz.open("pdf", pdf_bytes)
        for page in doc:
            text += page.get_text("text") + "\n"
    except Exception as e:
        logger.error(f"PDF-Fehler: {e}")
    return text.strip()

def extract_text_from_image(image_bytes):
    """Verwendet OCR, um Text aus einem Bild zu extrahieren."""
    try:
        image = Image.open(image_bytes)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        logger.error(f"OCR-Fehler: {e}")
        return ""

def convert_file_to_base64(file_bytes):
    """Konvertiert eine Datei in Base64 für KI-Interpretation."""
    return base64.b64encode(file_bytes).decode("utf-8")

@app.post("/ollama")
async def query_ollama(
    question: str = Form(...), 
    model: str = Form("deepseek-r1:7b"),
    file: UploadFile = None
):
    file_content = ""

    if file:
        file_ext = file.filename.split(".")[-1].lower()
        file_bytes = await file.read()

        if file_ext == "txt":
            file_content = file_bytes.decode("utf-8")
        elif file_ext == "pdf":
            file_content = extract_text_from_pdf(file_bytes)
        elif file_ext in ["jpg", "jpeg", "png"]:
            file_content = extract_text_from_image(file_bytes)
        else:
            file_content = f"[Base64-Daten für {file.filename}]\n{convert_file_to_base64(file_bytes)}"

    # Wenn es einen Anhang gibt, in den Prompt einfügen
    full_prompt = question
    if file and file_content:
        full_prompt += f"\n\n[Anhang: {file.filename}]\n{file_content}"

    payload = {
        "model": model,
        "prompt": full_prompt,
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
