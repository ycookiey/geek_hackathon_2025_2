// /lambda/utils/dynamodb.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-northeast-1", // 環境変数からリージョン取得
});

export const docClient = DynamoDBDocumentClient.from(client);
