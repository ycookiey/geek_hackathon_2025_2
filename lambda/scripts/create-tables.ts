import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import {
    purchaseRecordSchema,
    inventoryItemSchema,
    mealRecordSchema,
} from "../db/schema";

// DynamoDB クライアントを初期化
const client = new DynamoDBClient({
  region: "ap-northeast-1", // 東京リージョン
    endpoint: "http://dynamodb:8000",
    credentials: {
        accessKeyId: "DUMMYIDEXAMPLE",
        secretAccessKey: "DUMMYEXAMPLEKEY",
    },
});

// 作成するテーブル一覧
const tableSchemas = [
    purchaseRecordSchema,
    inventoryItemSchema,
    mealRecordSchema,
];

// テーブル作成関数
const createTables = async () => {
    for (const schema of tableSchemas) {
    try {
        console.log(`🔄 Creating table: ${schema.TableName}`);
        const command = new CreateTableCommand(schema);
        const response = await client.send(command);
        console.log(`✅ Table created: ${schema.TableName}`, response);
    } catch (error: any) {
        if (error.name === "ResourceInUseException") {
        console.log(`⚠️ Table already exists: ${schema.TableName}`);
        } else {
        console.error(`❌ Failed to create table: ${schema.TableName}`, error);
        }
    }
    }
};

// スクリプト実行
createTables()
    .then(() => console.log("🎉 All tables created successfully!"))
    .catch((err) => console.error("❌ Error creating tables:", err));
