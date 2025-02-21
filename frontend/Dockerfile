FROM node:22-alpine

WORKDIR /app

# Копируем зависимости
COPY package*.json ./

# Копируем исходный код
COPY . .

EXPOSE 5173

# Запускаем dev-сервер React (create-react-app по умолчанию использует react-scripts start)
CMD ["npm", "run", "dev"]

