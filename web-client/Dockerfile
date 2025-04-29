FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"] 