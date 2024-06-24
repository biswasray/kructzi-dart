FROM node:latest
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run bootstrap
RUN NODE_ENV="production" node env.config.js
CMD ["npm", "start"]
