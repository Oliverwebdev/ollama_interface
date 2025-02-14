🚀 **Aktualisierung der README.md**  
Wir bringen die README auf den neuesten Stand und fügen alle **neuen Features & Verbesserungen** hinzu:  
- **Neues Styling (OpenAI-Look)**
- **Responsive Design**
- **Anhänge (Bilder, PDFs, Text)**
- **Fehlerbehebung & Debugging-Tipps**

---

### **📌 Neue README.md**
```md
# EchoCore - KI Chat Interface

Dieses Projekt stellt eine moderne, interaktive Chat-Anwendung bereit, um über ein React-Frontend und ein Python/FastAPI-Backend mit einer lokalen Ollama-Instanz zu interagieren.  
Es nutzt **modernes Styling (OpenAI-Look)**, **mobile Optimierung** und erlaubt den Upload von **Bildern, PDFs & Textdateien** zur Analyse durch das KI-Modell.

## 📌 Inhaltsverzeichnis
* [Überblick](#überblick)
* [Technologie-Stack](#technologie-stack)
* [Projektstruktur](#projektstruktur)
* [Voraussetzungen](#voraussetzungen)
* [Installation & Start](#installation--start)
* [Nutzung](#nutzung)
* [Features](#features)
* [Konfiguration](#konfiguration)
* [Fehlersuche](#fehlersuche)
* [Zukünftige Erweiterungen](#zukünftige-erweiterungen)
* [Lizenz](#lizenz)

---

## 🚀 **Überblick**
- **Frontend (React + Vite)** → Moderner Chat mit OpenAI-Optik  
- **Backend (FastAPI)** → Sendet Anfragen an Ollama (lokale KI)  
- **Ollama** → Führt KI-Modelle aus (`deepseek-r1:7b` oder andere)  
- **Docker & Docker Compose** → Container-Management  

### 🔗 **Datenfluss**
```txt
[Browser / Frontend] → [FastAPI-Backend in Docker] → [Ollama auf dem Host-System]
```

---

## ⚡ **Technologie-Stack**
- **React mit Vite** (Frontend)
- **Python 3.10 mit FastAPI** (Backend)
- **Docker & Docker Compose**
- **Ollama (Lokaler Modellserver)**

---

## 📂 **Projektstruktur**
```
echocore/
├── backend/
│   ├── Dockerfile           # Backend (Python) Container Setup
│   ├── requirements.txt     # Python-Abhängigkeiten
│   ├── main.py              # FastAPI-App (mit /ollama Endpoint)
├── frontend/
│   ├── Dockerfile           # Frontend (Node/Vite) Container Setup
│   ├── package.json         # NPM-Skripte & Dependencies
│   ├── src/
│   │   ├── App.jsx          # React-Hauptkomponente (Chat-UI)
│   │   ├── App.css          # Komplettes UI-Styling (Desktop + Mobile)
│   │   └── Spinner.jsx      # Lade-Animation
├── docker-compose.yml       # Orchestrierung für Frontend + Backend
├── README.md                # Dieses Dokument
└── .gitignore               # Verhindert unnötige Uploads
```

---

## 🛠 **Voraussetzungen**
- **Docker (empfohlen Version ≥ 20.10)**
- **Docker Compose (≥ 1.29)**
- **Ollama lokal installiert (≥ 0.4.5)**
- **Python nur für lokale Backend-Starts notwendig**

---

## 🚀 **Installation & Start**
### **1️⃣ Docker Compose starten**
```bash
cd echocore
sudo docker compose up --build
```
- **Frontend läuft unter:** `http://localhost:5173`
- **Backend API unter:** `http://localhost:8000/docs`
- **Ollama KI läuft auf:** `http://localhost:11434`

---

## 💬 **Nutzung**
### **📥 Eingabe**
- Der User gibt eine Nachricht ein.
- Falls **Anhänge (Bilder, PDFs, TXT) vorhanden sind**, werden sie mitgesendet.

### **🔄 Verarbeitung**
- **FastAPI empfängt die Anfrage**  
- Falls eine Datei gesendet wurde:
  - **TXT → Direkt in den Prompt eingefügt**
  - **PDF → Text extrahiert & angehängt**
  - **Bilder → OCR-Texterkennung mit Tesseract**
  - **Andere Formate → In Base64 gewandelt**

### **📤 Antwort**
- Ollama verarbeitet die Eingabe & sendet das JSON zurück.
- **Frontend zeigt die Antwort mit OpenAI-Optik im Chat an.**
- Falls `<think>`-Tags erkannt werden, erscheinen diese als **Denkblasen**.

---

## 🌟 **Features**
✅ **🔹 Modernes Chat-Design (OpenAI-Stil)**  
✅ **📱 100% Responsive (Mobile & Desktop)**  
✅ **📂 Anhänge: PDFs, Bilder, Textdateien analysieren**  
✅ **🧠 `<think>`-Tags als Denkblasen anzeigen**  
✅ **🎨 Light & Dark Mode-Unterstützung (optional)**  
✅ **⚡ Schnelle Performance dank Vite & FastAPI**

---

## ⚙️ **Konfiguration**
### **🔧 Frontend (`App.jsx`)**
- **Chat-UI & Denkblasen-Logik**
- **Request an `http://localhost:8000/ollama`**
- **Styling in `App.css` für OpenAI-Optik**

### **🔧 Backend (`main.py`)**
- **Ollama URL:** `http://host.docker.internal:11434/api/generate`
- **Modelleinstellungen:** Standard `"deepseek-r1:7b"`  
  → Kann für andere Modelle geändert werden.

### **🔧 Docker Compose**
- **Definiert `frontend` & `backend`**
- `extra_hosts: "host.docker.internal:host-gateway"` für Netzwerkzugriff

---

## 🔍 **Fehlersuche**
### 🛠 **Backend gibt 500-Fehler**
```bash
docker compose logs backend
```
- **Lösung:** Prüfe, ob Ollama läuft (`ollama serve`).

### 🛠 **Frontend zeigt keine Nachrichten**
- **Lösung:** `F12` → **Console öffnen** → Fehler in `messages` überprüfen.

### 🛠 **Anhänge werden nicht verarbeitet**
- **Lösung:** Backend-Logs prüfen (`docker compose logs backend`).
- **Falls OCR nicht funktioniert:** `tesseract-ocr` nachinstallieren.

---

## 🚀 **Zukünftige Erweiterungen**
✅ **Live-Streaming von Antworten (`stream: true`)**  
✅ **Weitere Datei-Formate wie MP3-Transkription**  
✅ **Offline-Modus für lokale Nutzung**  
✅ **Modell-Auswahl direkt im Chat**  

---

## 📜 **Lizenz**
Dieses Projekt ist Open Source. Nutze es, verbessere es & entwickle es weiter! 🚀  
Falls du Features beisteuern willst – Pull Requests sind willkommen! 😎  
```

---

## **🚀 Was ist neu in dieser README?**
✅ **Aktueller Name (`EchoCore` statt `Ollama Chat Interface`)**  
✅ **Neue Features (`think`-Tags, Responsive Design, OpenAI-Look)**  
✅ **Optimierte Projektstruktur & Nutzung von Anhängen**  
✅ **Fehlersuche-Abschnitt für Debugging-Tipps**  
✅ **Zukunftsplanung für Erweiterungen**  

---
