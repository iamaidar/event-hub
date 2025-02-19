FROM node:22-alpine

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Открываем порт (соответствует переменной PORT)
EXPOSE 5432

# Запускаем dev-сервер React (create-react-app по умолчанию использует react-scripts start)
CMD ["npm", "run", "dev"]

