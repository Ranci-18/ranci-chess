# base nodejs image
FROM node:20.10-alpine

# the woking directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json to the working directory
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application files
COPY . .

# build the app
RUN npm run build

# expose the app port
EXPOSE 3000

# define the command to run the app
CMD ["npm", "start"]