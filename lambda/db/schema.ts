import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" }); // 東京リージョン

// 🎯 PurchaseRecord テーブル
const purchaseRecordParams = {
    TableName: "PurchaseRecord",
    KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" }, // パーティションキー
    { AttributeName: "purchaseId", KeyType: "RANGE" }, // ソートキー
    ],
    AttributeDefinitions: [
    { AttributeName: "userId", AttributeType: "S" },//S→string
    { AttributeName: "purchaseId", AttributeType: "S" },
    { AttributeName: "purchaseDate", AttributeType: "S" }, // GSI用の属性
    ],
    GlobalSecondaryIndexes: [
    {
        IndexName: "PurchaseDateIndex",
        KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" },
        { AttributeName: "purchaseDate", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },//1 KB の項目を1秒に1回読む,1 KB の項目を1秒に1回書く
};

// 🎯 InventoryItem テーブル
const inventoryItemParams = {
    TableName: "InventoryItem",
    KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" },
    { AttributeName: "itemId", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
    { AttributeName: "userId", AttributeType: "S" },
    { AttributeName: "itemId", AttributeType: "S" },
    { AttributeName: "expiryDate", AttributeType: "S" }, // GSI用
    { AttributeName: "storageLocation", AttributeType: "S" }, // GSI用
    ],
    GlobalSecondaryIndexes: [
    {
        IndexName: "ExpiryDateIndex",
        KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" },
        { AttributeName: "expiryDate", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    {
        IndexName: "StorageLocationIndex",
        KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" },
        { AttributeName: "storageLocation", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
};

// 🎯 MealRecord テーブル
const mealRecordParams = {
    TableName: "MealRecord",
    KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" },
    { AttributeName: "recordDate", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
    { AttributeName: "userId", AttributeType: "S" },
    { AttributeName: "recordDate", AttributeType: "S" },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
};

// 🎯 テーブル作成関数
const createTable = async (params: any) => {
    try {
    const data = await client.send(new CreateTableCommand(params));
    console.log(`✅ Table created: ${params.TableName}`);
    } catch (error) {
    console.error(`❌ Error creating table ${params.TableName}:`, error);
    }
};

// 🎯 すべてのテーブルを作成
const createAllTables = async () => {
    await createTable(purchaseRecordParams);
    await createTable(inventoryItemParams);
    await createTable(mealRecordParams);
};

createAllTables();
