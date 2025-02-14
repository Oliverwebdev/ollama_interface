FROM node:18-alpine

# Arbeitsverzeichnis festlegen
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package.json package-lock.json ./
RUN npm install

# Restlichen Code kopieren
COPY . .

# Port freigeben
EXPOSE 5173

# Starte die App
CMD ["npm", "run", "dev"]
