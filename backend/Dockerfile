FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code into the container
COPY . .

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

# Use the custom entrypoint
ENTRYPOINT ["./entrypoint.sh"]
