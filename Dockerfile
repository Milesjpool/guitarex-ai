# Frontend build stage
FROM node:20-alpine as frontend-builder

WORKDIR /app/frontend
COPY web-client/package*.json ./
RUN npm install

# Copy TypeScript config files
COPY web-client/tsconfig*.json ./

# Copy the rest of the frontend files and build
COPY web-client/ .
RUN npm run build

# Backend stage
FROM python:3.11-slim

WORKDIR /app

# Install backend dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend code
COPY server/ .

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist /app/static

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"] 