FROM node:18

# Create api directory
WORKDIR /opt/api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./api/package*.json ./

RUN npm install

# Bundle app source
COPY ./api ./

EXPOSE 3000

CMD [ "npm", "run", "start" ]