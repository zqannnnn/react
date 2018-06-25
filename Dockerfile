FROM node:carbon

RUN yarn config set registry https://registry.npm.taobao.org 
COPY . /opt/projects/bmp
RUN chown -R node:users /opt/projects/bmp
USER node
WORKDIR /opt/projects/bmp
CMD ["/usr/local/bin/npm", "run-script", "watch"]
