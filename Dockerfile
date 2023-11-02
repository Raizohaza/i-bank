FROM node:14-bullseye as builder

RUN apt-get update
RUN apt install cmake -y

# For some reason, the following line is needed to install the node
RUN git clone https://github.com/mongodb/libmongocrypt
WORKDIR /libmongocrypt/cmake-build
RUN cmake ../
RUN make
RUN make install

ENV NODE_ENV build

WORKDIR /home/node

COPY package.json ./

RUN npm install

# test
RUN yarn nx build api-gateway
