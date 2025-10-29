FROM node:18-alpine AS build-stage

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

# Stage 2: Serve the Vite app with nginx
FROM nginx:alpine AS production-stage

# Copy the built app from the previous stage to nginx public directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
