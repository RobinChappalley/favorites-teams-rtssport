FROM node:latest

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 3000

# Use the custom entrypoint
#CMD ["tail", "-f", "/dev/null"]
ENTRYPOINT ["./entrypoint.sh"]
