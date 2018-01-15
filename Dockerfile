FROM node:carbon

MAINTAINER Alexander Ververis <alexander.ververis@mail.com

RUN yarn config set registry https://registry.npm.taobao.org 
COPY . /home/node/bounty-management-platform
RUN chown -R node:users /home/node/bounty-management-platform
USER node
WORKDIR /home/node/bounty-management-platform
CMD ["/usr/local/bin/npm", "run-script", "watch"]
