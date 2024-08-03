import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: 'ap-northeast-1',
  endpoint: 'http://localhost:8085',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('ここまではきてる-000');
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };

  const path = event.path;
  const method = event.httpMethod;
  const body = JSON.parse(event.body || '{}');
  const params = event.pathParameters || {};

  try {
    if (path === '/api/test/create-table' && method === 'POST') {
      const createTableParams = {
        TableName: 'TestTable',
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };
      const data = await client.send(new CreateTableCommand(createTableParams));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Table created', data }),
      };
    }

    if (path === '/api/test/put-item' && method === 'POST') {
      const putItemParams = {
        TableName: 'TestTable',
        Item: {
          id: body.id,
          data: body.data,
        },
      };
      const data = await dynamo.send(new PutCommand(putItemParams));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Item added', data }),
      };
    }

    if (path === `/api/test/get-item/${params.id}` && method === 'GET') {
      const getItemParams = {
        TableName: 'TestTable',
        Key: {
          id: params.id,
        },
      };
      const data = await dynamo.send(new GetCommand(getItemParams));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data: data.Item }),
      };
    }

    if (path === '/api/test/get-all-items' && method === 'GET') {
      console.log('ここまではきてるんやけどね！！！');
      const scanParams = {
        TableName: 'TestTable',
      };
      const data = await dynamo.send(new ScanCommand(scanParams));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data: data.Items }),
      };
      // return {
      //   body: JSON.stringify({ message: 'APIGateway' }),
      // };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not Found' }),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message, stack: err.stack }),
    };
  }
};
