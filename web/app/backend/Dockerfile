# Käytetään virallista Node.js-kuvaa pohjana
FROM node:18

# Määritetään työskentelykansio kontissa
WORKDIR /app

# Kopioidaan backendin package.json ja package-lock.json
COPY backend/package*.json ./backend/

# Asennetaan riippuvuudet
RUN cd backend && npm install

# Kopioidaan vain backend-hakemisto
COPY backend/ ./backend/

# Portti, jossa sovellus toimii
EXPOSE 5000

# Käynnistetään sovellus
CMD ["node", "backend/server.js"]
