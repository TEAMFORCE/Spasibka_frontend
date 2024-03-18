# stage1 as builder
FROM node:18-alpine as builder

ARG APP_ENVIRONMENT="development"
ARG APP_API_URL
ARG APP_GTAG=""

WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .
RUN echo "VUE_APP_ENVIRONMENT=$APP_ENVIRONMENT" > ./.env \
    && echo "VUE_APP_API_URL=$APP_API_URL" >> ./.env \
    && echo "VUE_APP_GTAG=$APP_GTAG" >> ./.env

# Build the project
RUN npm run build


FROM nginx:alpine as production-build

COPY ./compose/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
