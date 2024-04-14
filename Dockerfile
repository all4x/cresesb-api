# Usa a imagem base do node especificada
FROM node:20@sha256:cb7cd40ba6483f37f791e1aace576df449fc5f75332c19ff59e2c6064797160e

# Instalação do Chrome e configurações
RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
  && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
  --no-install-recommends \
  && service dbus start \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -r app && useradd -rm -g app -G audio,video app

# Define o usuário de trabalho
USER app

# Define o diretório de trabalho
WORKDIR /home/app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código-fonte
COPY ./src/ ./src/

# Compila o projeto
RUN npm run build

# Altera a propriedade do diretório
USER root
RUN chown -R app:app /home/app \
  && chmod -R 777 /home/app

# Define a porta a ser exposta
EXPOSE 3003

# Comando padrão para iniciar o servidor
CMD ["node", "/home/app/dist/server.js"]

