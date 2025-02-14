Ollama Interface
Ollama Interface ist ein grundlegendes Projekt, das mit Docker containerisiert wurde. Es bietet eine einfache Benutzeroberfläche (Frontend) in Kombination mit einem Python-basierten Backend. Das Ziel ist es, eine plattformübergreifende Lösung bereitzustellen, die lokal ausgeführt werden kann – beispielsweise um eine lokale Ollama-Instanz zu steuern und darzustellen.

Technologie-Stack
Backend:

Basis: python:3.10-slim
Webserver: Uvicorn (FastAPI-ähnliche Anwendung)
Port: 8000
Frontend:

Basis: node:18-alpine
Entwicklungsserver: Vite
Standard-Port: 5173 (wurde angepasst, um auf allen Schnittstellen zu lauschen)
Orchestrierung:

Docker Compose (über separate Dockerfiles in den Verzeichnissen und eine zentrale docker-compose.yml)
Projektstruktur
csharp
Kopieren
ollamainterface/
├── backend/
│   ├── Dockerfile         # Dockerfile für das Python-Backend
│   ├── requirements.txt   # Python-Abhängigkeiten
│   └── [Backend-Code]
├── frontend/
│   ├── Dockerfile         # Dockerfile für das Node/Vite-Frontend
│   ├── package.json       # NPM-Konfiguration
│   ├── package-lock.json  
│   └── [Frontend-Code]
└── docker-compose.yml     # Orchestrierung beider Container
So startest du das Projekt
Voraussetzungen:

Docker (Version ≥ 26.x)
Docker Compose (entweder als Plugin oder eigenständige Installation)
Projekt starten:
Im Hauptverzeichnis (ollamainterface) kannst du folgenden Befehl ausführen:

bash
Kopieren
sudo docker compose up --build
Dabei werden beide Images gebaut und die Container gestartet.

Erreichbarkeit der Dienste:

Backend: erreichbar unter http://localhost:8000
Frontend: erreichbar unter http://localhost:5173
Hinweis: Der Vite-Server wurde so konfiguriert, dass er mit dem Parameter --host alle Netzwerkinterfaces abhorcht, damit er vom Host aus erreichbar ist.

Aktuelle Funktionen
Backend:
Startet einen Uvicorn-Server, der Anfragen auf Port 8000 entgegennimmt.
Frontend:
Läuft mit Vite im Entwicklungsmodus und stellt die Benutzeroberfläche bereit.
Containerisierung:
Beide Services werden mittels Docker und Docker Compose orchestriert.
Optimierte Dockerfiles nutzen den Build-Cache, um unnötige Neuinstallationen (z. B. npm install) zu vermeiden.
Zukünftige Aufgaben
Integration der lokalen Ollama-Instanz:

Anbindung des Backends an die lokale Ollama-Instanz, um deren Funktionen im Interface darzustellen.
Frontend-Erweiterungen:

Verbesserung des UI/UX-Designs.
Hinzufügen weiterer Features, wie z. B. interaktive Elemente, Chat-Funktionen o. Ä.
Authentifizierung und Sicherheit:

Implementierung von Benutzeranmeldung und Berechtigungsprüfungen.
Sicherheitsverbesserungen (z. B. HTTPS, Rate Limiting).
Monitoring und Logging:

Integration von Logging- und Monitoring-Lösungen, um Fehler schneller zu identifizieren.
Optimierung und Automatisierung:

Einrichtung einer CI/CD-Pipeline zur automatischen Bild-Erstellung, Tests und Deployment.
Weitere Container-Optimierungen, um den Ressourcenverbrauch zu minimieren.
Dokumentation und Tests:

Erweiterung der Dokumentation (sowohl für Entwickler als auch für Endnutzer).
Schreiben von Integrationstests, um die Kommunikation zwischen Frontend, Backend und der Ollama-Instanz sicherzustellen.
Lizenz
[Hier Lizenzinformationen einfügen – z.B. MIT License]

