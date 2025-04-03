// /lambda/utils/dynamodb.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "ap-northeast-1", // 環境変数からリージョン取得
    endpoint: process.env.DYNAMODB_ENDPOINT, // ローカル開発用、本番では未設定にするなど
});

export const docClient = DynamoDBDocumentClient.from(client);
export const INVENTORY_TABLE_NAME = process.env.INVENTORY_TABLE_NAME || "InventoryItem";