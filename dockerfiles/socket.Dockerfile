FROM node:18

# Create api directory
WORKDIR /opt/socket

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./socket/package*.json ./

RUN npm install

# Bundle app source
COPY ./socket ./

EXPOSE 3001

CMD [ "npm", "run", "start" ]