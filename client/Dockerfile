FROM node:23-bookworm-slim

EXPOSE 5173

WORKDIR /app

RUN apt update -y && \
    apt install -y htop && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json /app

RUN npm install

COPY . /app

CMD ["npm", "run", "dev"]
