# Käytetään virallista Node.js-kuvaa pohjana
FROM node:18

# Määritetään työskentelykansio kontissa
WORKDIR /app/backend

# Kopioidaan backendin package.json ja package-lock.json
COPY package*.json ./

# Asennetaan riippuvuudet
RUN npm install

# Kopioidaan vain backend-hakemisto
COPY backend/ ./

# Portti, jossa sovellus toimii
EXPOSE 5000

# Käynnistetään sovellus
CMD ["node", "server.js"]
