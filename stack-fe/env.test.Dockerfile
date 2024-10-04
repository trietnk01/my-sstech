# Stage 1
FROM node:20-alpine as build-stage
WORKDIR /usr/frontend
COPY package.json ./
RUN npm install
COPY . .
RUN rm -rf build
RUN npm run build:test 
FROM nginx:1.23.3
COPY --from=build-stage /usr/frontend/dist /usr/share/nginx/html

