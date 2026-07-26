# Stage 1: Build the Vite application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the static output using Nginx
FROM nginx:alpine
# Copy the built assets from the previous stage to Nginx's default public directorys
COPY --from=build /app/dist /usr/share/nginx/html