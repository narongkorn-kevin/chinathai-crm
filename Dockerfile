### STAGE 1: Build ###
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build:prod

### STAGE 2: Run ###
FROM nginx:1.25.5-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist/fuse /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
