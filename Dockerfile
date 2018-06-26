FROM node:carbon

RUN yarn config set registry https://registry.npm.taobao.org 
COPY . /home/node/bmp
RUN chown -R node:users /home/node/bmp
USER node
WORKDIR /home/node/bmp
CMD ["/usr/local/bin/npm", "run-script", "watch"]
