import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {DynamoDBClient, DynamoDBClientConfig} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, ScanCommand,} from '@aws-sdk/lib-dynamodb';

const clientConfig: DynamoDBClientConfig =
    process.env.AWS_SAM_LOCAL ?
    {
    region: 'ap-northeast-1',
    endpoint: 'http://dynamodb-local:8000',
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
        }
    } : {}


// @ts-ignore
const client = new DynamoDBClient(clientConfig);
const dynamo = DynamoDBDocumentClient.from(client);
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    };
    console.log('app.tsのここは問題なく通ってる感じかね')

    try {
        const scanParams = {
            TableName: 'TestTable',
        };
        const data = await dynamo.send(new ScanCommand(scanParams));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ data: data.Items }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
