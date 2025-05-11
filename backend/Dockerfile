FROM node:22-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для кеширования установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Сборка проекта (компиляция TypeScript в JavaScript)
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем NestJS в продакшн-режиме
CMD ["npm", "run", "start:prod"]
