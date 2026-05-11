FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Audio cache lives on a persistent volume at /data/audio-cache
ENV AUDIO_CACHE_DIR=/data/audio-cache

EXPOSE 3000

CMD ["node", "src/index.js"]
