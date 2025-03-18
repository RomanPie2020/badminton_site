FROM node:23

WORKDIR /app

RUN echo ' \
alias ts="npx tsc --noEmit" \
 \
 \
' >> ~/.bashrc



COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]