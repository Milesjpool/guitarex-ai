# Development stage
FROM python:3.11-slim as development

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--debug"]

# Production stage
FROM node:20-alpine as frontend-builder

WORKDIR /app/frontend
COPY ../web-client/package*.json ./
RUN npm install
COPY ../web-client/ .
RUN npm run build

FROM python:3.11-slim as production

WORKDIR /app

# Install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend code
COPY . .

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist /app/static

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"] 