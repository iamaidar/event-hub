FROM node:22-alpine
WORKDIR /app

# Копируем только package*.json, чтобы залить зависимости в образ
COPY package*.json ./
RUN npm ci

# Копируем остальной код
COPY . .

CMD ["npm", "run", "dev"]