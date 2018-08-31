FROM node:carbon

COPY . /opt/projects/bmp
RUN chown -R node:users /opt/projects/bmp
USER node
WORKDIR /opt/projects/bmp
RUN yarn config set registry https://registry.npm.taobao.org 
CMD ["/usr/local/bin/npm", "run-script", "run"]
