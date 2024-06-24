# Dockerfile

# base image
FROM node:18.19-alpine3.18

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src 
# RUN cp "bak.env.stage" ".env"

# install dependencies
RUN yarn install


# start app
RUN yarn build
EXPOSE 3000
CMD yarn start
