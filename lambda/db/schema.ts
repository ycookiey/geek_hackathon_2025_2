import {
  DynamoDBClient,
  CreateTableCommand,
  CreateTableCommandInput,
} from "@aws-sdk/client-dynamodb";

// PurchaseRecord テーブルのスキーマ
const purchaseRecordSchema: CreateTableCommandInput = {
  TableName: "PurchaseRecord",
  KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" }, //パーテンションキー
    { AttributeName: "purchaseId", KeyType: "RANGE" }, //ソートキー
  ],
  AttributeDefinitions: [
    { AttributeName: "userId", AttributeType: "S" }, //S=String, N=Number, B=Binary
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
    { AttributeName: "sourcePurchaseId", AttributeType: "S" },
    { AttributeName: "category", AttributeType: "S" }, // ★ 追加: 新しい属性
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
        { AttributeName: "storageLocation", KeyType: "RANGE" }, // ここはRANGEキーで良いか要検討 (通常はFilterに使うことが多い) by gemini2.5pro
      ],
      Projection: { ProjectionType: "ALL" },
    },
    {
      IndexName: "SourcePurchaseIdIndex",
      KeySchema: [
        { AttributeName: "sourcePurchaseId", KeyType: "HASH" }, // sourcePurchaseId をハッシュキーとする
      ],
      // 削除に必要なキーだけ取得できれば良いので KEYS_ONLY で効率化
      Projection: { ProjectionType: "KEYS_ONLY" },
    },
  ],
  BillingMode: "PAY_PER_REQUEST",
};

// MealRecord テーブルのスキーマ
const mealRecordSchema: CreateTableCommandInput = {
  TableName: "MealRecord",
  KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" },
    { AttributeName: "recordId", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "userId", AttributeType: "S" },
    { AttributeName: "recordDate", AttributeType: "S" },
    { AttributeName: "recordId", AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    // ★ 追加: GSI の定義
    {
      IndexName: "RecordDateIndex", // meals/index.ts で使用する名前
      KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" }, // userId で絞り込み
        { AttributeName: "recordDate", KeyType: "RANGE" }, // recordDate で範囲検索・ソート
      ],
      Projection: { ProjectionType: "ALL" }, // クエリ結果に全属性を含める
    },
  ],
  BillingMode: "PAY_PER_REQUEST",
};

// エクスポート
export { purchaseRecordSchema, inventoryItemSchema, mealRecordSchema };
