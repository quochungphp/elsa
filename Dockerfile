FROM node:18

# working directory
RUN mkdir /app
WORKDIR /app

# update the operting system
RUN apt-get update

#copy all the files
COPY . .

# install node dependency and build project
RUN npm install
RUN npm run build

# container port
EXPOSE 9000 9001 9002

# run on container start command
CMD ["node", "dist/src/main.js"]
