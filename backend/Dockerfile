# Verwende ein leichtgewichtiges Python-Image
FROM python:3.10-slim
RUN apt-get update && apt-get install -y curl iputils-ping


# Arbeitsverzeichnis festlegen
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Restlichen Code kopieren
COPY . .

# Starte die App
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
