
# Estágio 1: Build da aplicação React
# Usamos uma imagem Node.js com Alpine Linux para um tamanho menor
FROM node:18-alpine as builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de definição de pacotes e instala as dependências
# Isso aproveita o cache de camadas do Docker
COPY package*.json ./
RUN npm install

# Copia o resto dos arquivos do projeto
COPY . .

# Executa o script de build para gerar os arquivos estáticos
RUN npm run build

# Estágio 2: Servir a aplicação com Nginx
# Usamos uma imagem Nginx leve
FROM nginx:1.23-alpine

# Copia os arquivos estáticos gerados no estágio de build para o diretório do Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx em modo 'foreground' quando o contêiner for executado
CMD ["nginx", "-g", "daemon off;"]
