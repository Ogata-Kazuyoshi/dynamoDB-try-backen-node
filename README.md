### 注意事項
- dockerで立ち上げたdynamodb-localのマウント先は./dynamodb_dataなので、ルートディレクトリ直下にそのフォルダを作って！！！ githubへはignoreしてUPしてません。
- 通常AWS上では、dynamoDB立ち上げ時にパーティションキーや属性、プロビジョニング設定を実施する。（cloudformationの場合も）


### 下記がAWS上

- 下記が実際のコード

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    let params = {
        "TableName": "ogata-user-table",
    };

    const res = await dynamo.send(
        new ScanCommand(params)
    ).then(elm => elm.Items)

    return res;
};


```

- IAMロールでDynamoDBへのフルアクセスをアタッチしてるが、それ以外は特に何もしてない
- ライブラリのインポートも不要
- aws-sdkのver3を使用すること