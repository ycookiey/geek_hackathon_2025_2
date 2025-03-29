# 1. ベースイメージの指定（Node.js 18）
FROM node:18-alpine

# 2. 作業ディレクトリを設定
WORKDIR /app

# 3. package.json と package-lock.json をコピー
COPY package*.json ./

# 4. 依存関係をインストール
RUN npm install

# 5. アプリケーションのソースコードをコピー
COPY . .

# 6. Next.js アプリのビルド
RUN npm run build

# 7. アプリケーションのポート指定
EXPOSE 3000

# 8. コンテナ起動時に実行するコマンド
CMD ["npm", "run", "start"]
