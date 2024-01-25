# build stage
FROM node:hydrogen-alpine as build-stage
WORKDIR /app
COPY . .
RUN corepack enable
RUN yarn
RUN yarn build

# production stage
FROM nginx:1.25.3-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/
CMD ["nginx", "-g", "daemon off;"]