FROM node
WORKDIR /app
Expose 8080
COPY package.json /app
RUN npm install
COPY . /app
CMD node server.js