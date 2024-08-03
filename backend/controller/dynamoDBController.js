import { Router } from 'express';
import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';

const router = Router();

const client = new DynamoDBClient({
  region: 'ap-northeast-1',
  endpoint: 'http://localhost:8085',
  credentials: {
    accessKeyId: 'dummy', // ダミーのアクセスキー
    secretAccessKey: 'dummy', // ダミーのシークレットキー
  },
});
const dynamo = DynamoDBDocumentClient.from(client);

// テーブル作成用エンドポイント
router.post('/create-table', async (req, res) => {
  const params = {
    TableName: 'TestTable',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    const data = await dynamo.send(new CreateTableCommand(params));
    res.send({ message: 'Table created', data });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// データのポスト用エンドポイント
router.post('/put-item', async (req, res) => {
  const params = {
    TableName: 'TestTable',
    Item: {
      id: req.body.id,
      data: req.body.data,
    },
  };

  try {
    const data = await dynamo.send(new PutCommand(params));
    res.send({ message: 'Item added', data });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// データのゲット用エンドポイント
router.get('/get-item/:id', async (req, res) => {
  const params = {
    TableName: 'TestTable',
    Key: {
      id: req.params.id,
    },
  };

  try {
    const data = await dynamo.send(new GetCommand(params));
    res.send({ data: data.Item });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// 全データ取得用エンドポイント
router.get('/get-all-items', async (req, res) => {
  const params = {
    TableName: 'TestTable',
  };

  try {
    const data = await dynamo.send(new ScanCommand(params));
    res.send({ data: data.Items });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get('/', (req, res) => {
  res.send({ message: 'node-js-server' });
});

// module.exports = router;
export default router;
