FROM python:3.8
# ARG APP_URL
# ENV SPOTIFY_REDIRECT_URI $APP_URL/api/v1/callback
# ENV REACT_APP_API_URL $APP_URL/api/v1
ENV CUDA_VISIBLE_DEVICES ""
COPY . /deej-ai.online-app
WORKDIR "/deej-ai.online-app"
RUN apt update && \
    apt-get install ffmpeg -y

# Install specific version of NodeJS
RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.16.0
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm install --global yarn && \
    yarn install && \
    yarn build && \
    pip install -r requirements-lock.txt
CMD yarn build && uvicorn backend.main:app --host=0.0.0.0
EXPOSE 8000
