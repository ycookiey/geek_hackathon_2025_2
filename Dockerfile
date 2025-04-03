# 1. ベースイメージの指定（Node.js 18）
FROM node:18-alpine

RUN apk add --no-cache git

# 2. 作業ディレクトリを設定
WORKDIR /app

# ディレクトリの所有権をnodeユーザーに変更
RUN mkdir -p /app/node_modules /app/.next && chown -R node:node /app

# nodeユーザーに切り替え
USER node

# 3. package.json と package-lock.json をコピー
COPY --chown=node:node package*.json ./

# 4. 依存関係をインストール
RUN npm install

# 5. アプリケーションのソースコードをコピー
# COPY . .

# 6. Next.js アプリのビルド
# RUN npm run build

# 7. アプリケーションのポート指定
EXPOSE 3000

# 8. コンテナ起動時に実行するコマンド
# CMD ["npm", "run", "start"]

# 開発モードで起動（ホットリロード対応）
CMD ["npm", "run", "dev"]