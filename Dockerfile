#LEARN MORE: https://dev.to/abbasogaji/how-to-dockerize-your-nestjs-app-for-production-2lmf
FROM node:14-alpine As production

WORKDIR /usr/src/app

COPY dist ./dist
COPY package.json ./
COPY .env.stage.production ./

RUN npm install --production

CMD ["npm", "run", "start"]
#CMD ["npm", "run", "start", "-p","$PORT"]