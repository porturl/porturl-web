# =================================================================
# Stage 1: Build the React application
# =================================================================
FROM node:24-alpine AS builder

# Set a default value for the project name
ARG PROJECT_NAME=porturl-web
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build the application
RUN npm run build

# =================================================================
# Stage 2: Serve the application from an Nginx server
# =================================================================
FROM nginx:1.29-alpine

RUN apk add --no-cache gettext
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Vite builds to 'dist' directory
COPY --from=builder /app/dist /usr/share/nginx/html

COPY entrypoint.sh /docker-entrypoint.d/20-envsubst.sh
RUN chmod +x /docker-entrypoint.d/20-envsubst.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
