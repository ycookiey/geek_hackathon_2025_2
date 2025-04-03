import { DynamoDBClient, CreateTableCommand, CreateTableCommandInput } from "@aws-sdk/client-dynamodb";

// PurchaseRecord テーブルのスキーマ
const purchaseRecordSchema: CreateTableCommandInput = {
    TableName: "PurchaseRecord",
    KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" },//パーテンションキー
    { AttributeName: "purchaseId", KeyType: "RANGE" },//ソートキー
    ],
    AttributeDefinitions: [
    { AttributeName: "userId", AttributeType: "S" },//S=String, N=Number, B=Binary
    { AttributeName: "purchaseId", AttributeType: "S" },
    { AttributeName: "purchaseDate", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
    {
        IndexName: "PurchaseDateIndex",
        KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" },
        { AttributeName: "purchaseDate", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
    },
    ],
    BillingMode: "PAY_PER_REQUEST",
};

// InventoryItem テーブルのスキーマ
const inventoryItemSchema: CreateTableCommandInput = {
    TableName: "InventoryItem",
    KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" },
    { AttributeName: "itemId", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
    { AttributeName: "userId", AttributeType: "S" },
    { AttributeName: "itemId", AttributeType: "S" },
    { AttributeName: "expiryDate", AttributeType: "S" },
    { AttributeName: "storageLocation", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
    {
        IndexName: "ExpiryDateIndex",
        KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" },
        { AttributeName: "expiryDate", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
    },
    {
        IndexName: "StorageLocationIndex",
        KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" },
        { AttributeName: "storageLocation", KeyType: "RANGE" },// ここはRANGEキーで良いか要検討 (通常はFilterに使うことが多い) by gemini2.5pro
        ],
        Projection: { ProjectionType: "ALL" },
    },
    ],
    BillingMode: "PAY_PER_REQUEST",
};

// MealRecord テーブルのスキーマ
const mealRecordSchema: CreateTableCommandInput = {
    TableName: "MealRecord",
    KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" },
    { AttributeName: "recordDate", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
    { AttributeName: "userId", AttributeType: "S" },
    { AttributeName: "recordDate", AttributeType: "S" },
    ],
    BillingMode: "PAY_PER_REQUEST",
};

// エクスポート
export { purchaseRecordSchema, inventoryItemSchema, mealRecordSchema };
