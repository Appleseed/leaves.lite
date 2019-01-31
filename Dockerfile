# This image will be based on the official nodejs docker image
FROM node:latest

# Set in what directory commands will run
WORKDIR /

# Put all our code inside that directory that lives in the container
ADD . /

# Install dependencies
RUN \
    npm install && \
    npm run build


# Tell Docker we are going to use this port
EXPOSE 9000

# The command to run our app when the container is run
CMD ["npm", "run", "start"]
