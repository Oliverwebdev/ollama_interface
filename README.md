
# Ollama Chat Interface

Dieses Projekt stellt eine einfache Chat-Anwendung bereit, um über ein React-Frontend und ein Python/FastAPI-Backend mit einer lokalen Ollama-Instanz zu interagieren. Ziel ist es, einen lokalen Sprachmodell-Server (Ollama) zu nutzen und dessen Ergebnisse in einer Chat-ähnlichen Oberfläche anzuzeigen.

## Inhaltsverzeichnis

*   [Überblick](#überblick)
*   [Technologie-Stack](#technologie-stack)
*   [Projektstruktur](#projektstruktur)
*   [Voraussetzungen](#voraussetzungen)
*   [Installation & Start](#installation--start)
*   [Nutzung](#nutzung)
*   [Konfiguration](#konfiguration)
*   [Wichtige Dateien](#wichtige-dateien)
*   [FAQ & Troubleshooting](#faq--troubleshooting)
*   [Zukünftige Aufgaben](#zukünftige-aufgaben)
*   [Lizenz](#lizenz)

## Überblick

*   **Frontend (React / Vite):** Bietet eine einfache Chat-Oberfläche im Stil eines Messenger-Layouts (ähnlich WhatsApp).
*   **Backend (FastAPI):** Nimmt Anfragen vom Frontend entgegen und leitet sie an die lokale Ollama-Instanz weiter.
*   **Ollama:** Ein lokaler Server, der Large Language Models (LLMs) laden und Inferenz ausführen kann.
*   **Docker & Docker Compose:** Orchestriert sowohl das Python-Backend als auch das React-Frontend in Containern.

Die Kommunikation erfolgt wie folgt:

[Browser / Frontend] → [FastAPI-Backend in Docker] → [Ollama auf dem Host-System]


## Technologie-Stack

*   React mit Vite (Frontend)
*   Python 3.10 mit FastAPI (Backend)
*   Docker Compose für das Container-Management
*   Ollama als lokaler Modellserver (außerhalb von Docker gestartet)

## Projektstruktur
ollamainterface/
├── backend/
│   ├── Dockerfile             # Dockerfile für das Backend (Python)
│   ├── requirements.txt      # Enthält Python-Abhängigkeiten
│   └── main.py               # FastAPI-Anwendung (mit POST /ollama Endpoint)
├── frontend/
│   ├── Dockerfile             # Dockerfile für das Frontend (Node/Vite)
│   ├── package.json          # NPM-Skripte und Abhängigkeiten
│   ├── src/
│   │   └── App.jsx           # React-Hauptkomponente (Chat-UI)
│   └── App.css               # Basisstyles für den Chat
├── docker-compose.yml         # Orchestrierung von frontend und backend
├── README.md                 # Dieses Dokument
└── .gitignore                # Ignoriert build-Dateien, node_modules, usw.

## Voraussetzungen

*   Docker (empfohlen Version 20.10 oder neuer)
*   Docker Compose (Plugin oder separat, ab Version 1.29 aufwärts)
*   Ollama lokal installiert (Version ≥ 0.4.5)
*   Python lokal nur erforderlich, wenn du das Backend außerhalb von Docker starten willst. Sonst wird alles über Docker abgewickelt.

**Hinweis:** Unter Linux ist `host.docker.internal` nicht standardmäßig definiert. In diesem Projekt wird das Problem über Docker Compose mit `extra_hosts` gelöst.

## Installation & Start

1.  **Docker Compose bauen und Container starten**

    ```bash
    cd ollamainterface
    sudo docker compose up --build
    ```

    Dabei werden die Images für `backend` und `frontend` erzeugt und beide Container gestartet.
    Das Backend lauscht auf Port 8000 (wird auf den Host weitergeleitet).
    Das Frontend lauscht auf Port 5173 (wird ebenfalls weitergeleitet).

2.  **Ollama lokal starten**

    ```bash
    export OLLAMA_HOST="[ungültige URL entfernt]"    # optional, wenn du auf allen Interfaces lauschen willst
    ollama serve
    ```

    Ollama lauscht per Default auf 127.0.0.1:11434.
    Achte darauf, dass `host.docker.internal` vom Container aus auf Port 11434 zugreifen kann.

3.  **Zugriff auf das Frontend**

    Rufe `http://localhost:5173` in deinem Browser auf.
    Du solltest eine einfache Chat-Oberfläche sehen.

4.  **Backend-Check**

    Rufe `http://localhost:8000/docs` auf.
    Du siehst die interaktive FastAPI-Dokumentation, mit dem POST-Endpoint `/ollama`.

## Nutzung

1.  **Eingabe im Frontend**

    Im Textfeld kannst du eine Nachricht oder Frage eingeben.
    Mit Klick auf Senden wird diese an den FastAPI-Endpoint `/ollama` geschickt.

2.  **Backend-Weiterleitung**

    Das Backend erhält die Frage und baut einen Request an Ollama auf:

    ```json
    {
      "model": "deepseek-r1:7b",
      "prompt": "Hier steht deine Frage...",
      "stream": false
    }
    ```

3.  **Ollama-Antwort**

    Ollama verarbeitet die Anfrage und gibt ein JSON zurück, z.B.:

    ```json
    {
      "response": "Hallo! Wie kann ich dir helfen?",
      "done": true,
      ...
    }
    ```

    Das Backend liefert genau dieses JSON an das Frontend weiter.

4.  **Darstellung**

    Das Frontend zeigt die Antwort in einer Chat-Bubble (links, Rolle = Bot).
    Deine eigene Nachricht wird (rechts, Rolle = User) dargestellt.

## Konfiguration

*   **Frontend:**
    *   `App.jsx`: Enthält das Chat-Layout. Ruft per `fetch("http://localhost:8000/ollama")` das Backend auf.
*   **Backend (`main.py`):**
    *   `OLLAMA_URL = "http://host.docker.internal:11434/api/generate"`: Hier wird Ollama angesprochen.
    *   Ändere ggf. den Modellsnamen `"deepseek-r1:7b"` in `payload` auf deinen gewünschten Modellnamen.
*   **Docker Compose:**
    *   `extra_hosts` im `docker-compose.yml`: sorgt dafür, dass `host.docker.internal` in Linux-Containern aufgelöst werden kann.

## Wichtige Dateien

*   **`docker-compose.yml`**: Enthält die Definition für die Services `backend` und `frontend`. Mapped Ports 8000 und 5173.
*   **`backend/main.py`**: FastAPI-Server, der `/ollama`-Endpoint bereitstellt.
*   **`frontend/src/App.jsx`**: Zentrale React-Komponente mit Chat-Interface und Logik für das Absenden der Eingaben.
*   **`frontend/src/App.css` (oder `App.css`):** Enthält das Basis-CSS für den Chatbubbles-Stil und ggf. Farbanpassungen.
*   **`.gitignore`**: Verhindert das Einchecken von `node_modules/`, virtuellen Environments, Build-Artefakten usw.

## FAQ & Troubleshooting

1.  **500-Fehler beim Anfragen des Backends**

    Schaue in `docker compose logs backend`. Oft liegt es daran, dass Ollama nicht erreichbar ist (etwa weil es nur auf 127.0.0.1 lauscht oder das Modell nicht geladen werden konnte).

2.  **Kein Zugriff auf `host.docker.internal`**

    Prüfe, ob Docker deine Version von `extra_hosts: "host.docker.internal:host-gateway"` unterstützt.
    Oder setze Ollama auf 0.0.0.0:11434 und prüfe die IP per `curl` direkt im Container.

3.  **CORS-Fehler**

    In `main.py` ist `CORSMiddleware` aktiviert. Prüfe, ob `allow_origins` den korrekten Frontend-Port (`http://localhost:5173`) erlaubt.

## Zukünftige Aufgaben

*   Streaming aktivieren (`stream: true` im Ollama-Payload), um Token für Token zu empfangen.
*   Authentifizierung (z.B. OAuth, Token) für das Backend, falls du die Instanz nicht öffentlich zugänglich machen willst.
*   Design-Verbesserungen für das Chat-Frontend (Themes, Responsiveness, etc.).
*   Weitere Modelle einbinden – je nach Ollama-Kompatibilität.


