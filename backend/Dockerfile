FROM node:22-alpine

WORKDIR /app

# Копируем только package.json и package-lock.json для кеширования установки зависимостей
COPY package*.json ./
RUN npm install

# Копируем остальные файлы (это действие можно выполнить, но при монтировании volume изменения будут подхватываться)
COPY . .

# Открываем порт
EXPOSE 3000

# Запускаем NestJS в режиме разработки (hot-reload)
CMD ["npm", "run", "start:dev"]

