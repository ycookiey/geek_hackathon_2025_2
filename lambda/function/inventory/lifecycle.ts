import { DynamoDBClient, UpdateItemCommand, DeleteItemCommand, QueryCommand, ReturnValue, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDBClient = new DynamoDBClient({
  region: "ap-northeast-1", // 東京リージョン
    endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
});

// ✅ 1. アイテム消費後の在庫更新
export const consumeInventoryItem = async (
    userId: string,
    itemId: string,
    quantityConsumed: number
) => {
    const params = {
    TableName: "InventoryItem",
    Key: {
        userId: { S: userId },
        itemId: { S: itemId },
    },
    UpdateExpression: "SET quantity = quantity - :q",
    ExpressionAttributeValues: {
        ":q": { N: quantityConsumed.toString() },
    },
    ConditionExpression: "quantity >= :q",
    ReturnValues: "UPDATED_NEW" as ReturnValue,//as ReturnValue,を消すとstringとして認識されちゃうためエラーがでるみたい
    };

    try {
    const result = await dynamoDBClient.send(new UpdateItemCommand(params));
    console.log(`✅ Inventory updated for item: ${itemId}`);
    return result;
    } catch (error: any) {
    console.error(`❌ Error updating inventory: ${error.message}`);
    throw error;
    }
};

// ✅ 2. 期限切れアイテムの自動削除
export const removeExpiredItems = async (userId: string, currentDate: string) => {
    const queryParams = {
    TableName: "InventoryItem",
    IndexName: "expiryDate-index",
    KeyConditionExpression: "userId = :uid AND expiryDate <= :today",
    ExpressionAttributeValues: {
        ":uid": { S: userId },
        ":today": { S: currentDate },
    },
    };

    try {
    const queryResult = await dynamoDBClient.send(new QueryCommand(queryParams));

    for (const item of queryResult.Items || []) {
        const deleteParams = {
        TableName: "InventoryItem",
        Key: {
            userId: item.userId,
            itemId: item.itemId,
        },
        };
        await dynamoDBClient.send(new DeleteItemCommand(deleteParams));
        console.log(`🗑️ Deleted expired item: ${item.itemId.S}`);
    }
    console.log(`✅ Expired items removed for user: ${userId}`);
    } catch (error: any) {
    console.error(`❌ Error removing expired items: ${error.message}`);
    throw error;
    }
};

// ✅ 3. 購入時の在庫追加
export const addInventoryItem = async (
    userId: string,
    itemId: string,
    name: string,
    quantity: number,
    purchaseDate: string,
    expiryDate: string,
    storageLocation: string,
    purchaseId: string
) => {
    const params = {
    TableName: "InventoryItem",
    Item: {
        userId: { S: userId },
        itemId: { S: itemId },
        name: { S: name },
        quantity: { N: quantity.toString() },
        purchaseDate: { S: purchaseDate },
        expiryDate: { S: expiryDate },
        storageLocation: { S: storageLocation },
        purchaseId: { S: purchaseId },
        },
    };

    try {
    await dynamoDBClient.send(new PutItemCommand(params));//AIの出力からUpdateItemCommand→PutItemCommandに変更、多分大丈夫
    console.log(`✅ Item added to inventory: ${itemId}`);
    } catch (error: any) {
    console.error(`❌ Error adding item: ${error.message}`);
    throw error;
    }
};
