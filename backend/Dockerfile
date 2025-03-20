FROM node:latest

WORKDIR /app

# Copy package and lock files first
COPY ./package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 3000

CMD ["npm", "start"]