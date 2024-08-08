# AWS-cloudFormation

<details open="open">
<summary>目次</summary>


- [注意事項](#注意事項)
- [AWSLambdaで動作確認](#AWSLambdaで動作確認)
- [AWS SAM(ローカルでの確認)の使用方法](#AWS SAM(ローカルでの確認)の使用方法)
- [docker関係](#docker関係)
- [備考](#備考)
- [参考](#参考)
</details>


### 注意事項
- dockerで立ち上げたdynamodb-localのマウント先は./dynamodb_dataなので、ルートディレクトリ直下にそのフォルダを作って！！！ githubへはignoreしてUPしてません。
- 通常AWS上では、dynamoDB立ち上げ時にパーティションキーや属性、プロビジョニング設定を実施する。（cloudformationの場合も）


### AWSLambdaで動作確認

- 下記が実際のコード
- ESmoduleだと「.mjs」、CommonJSだと「.cjs」にすることに注意。下記はESmoduleのため「.mjs」で記載

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
        "TableName": "<table-name>",
    };

    const res = await dynamo.send(
        new ScanCommand(params)
    ).then(elm => elm.Items)

    return res;
};


```

- IAMロールでDynamoDBへのフルアクセスをアタッチすると、IAMユーザーの書き込み権限がついてくるのでセキュリティ上よくない。下のポリシーを自分でかく
- ライブラリのインポートも不要
- aws-sdkのver3を使用すること

```applicatio.json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"dynamodb:CreateTable",
				"dynamodb:PutItem",
				"dynamodb:GetItem",
				"dynamodb:Scan"
			],
			"Resource": "arn:aws:dynamodb:ap-northeast-1:<アカウントID>:table/<テーブル名>"
		}
	]
}
```

### AWS SAM(ローカルでの確認)の使用方法

<details>
<summary> 1. インストール</summary>

- 下記コマンドでインストール

```zh
   brew tap aws/tap
   brew install aws-sam-cli
```

</details>

<details>
<summary> 2. プロジェクトのセットアップ</summary>

- 下記コマンドでインストール
- runtimeを選んだ後にプロジェクトを選択するとtsが選べる

```zh
   sam init <--runtime nodejs18.x>
```

</details>

<details>
<summary> 3. トランスパイルできるように、SAMプロジェクト直下にtsconfigを設定</summary>


```zh
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ES6",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["lambdafunction/**/*.ts"],
  "exclude": ["node_modules"]
}
```

</details>

<details>
<summary> 4. ローカルで実行時の手順</summary>

- sam buidが必要
- 立ち上がるDokcerコンテナをDynamoDBーlocalと同じコンテナで立ち上げるために、--docker-network <dynamodb-try_local-dev-net>オプションが必要
- makefileでまとめておくと楽「make start」で実行できるようにしている

```zh
   sam init <--runtime nodejs18.x>
```

</details>

# docker関係

<details>
<summary> 1. 下記のようにネットワークを指定すると「dynamodb-try_local-dev-net」に属する/</summary>

- 頭に、現在のディレクトリー名が入るので要注意！！「local-dev-net」ではない！！

```application.yml
   version: '3.9'

services:
  dynamodb-local:
    container_name: dynamodb-local
    image: amazon/dynamodb-local
    ports:
      - '8085:8000'
    command: -jar DynamoDBLocal.jar -dbPath /data -sharedDb
    volumes:
      - ./dynamodb_data:/data # 修正
    networks:
      - local-dev-net
    restart: unless-stopped
  dynamodb-admin:
    container_name: dynamodb-admin
    image: aaronshaf/dynamodb-admin:latest
    environment:
      - DYNAMO_ENDPOINT=http://dynamodb-local:8000 # 修正
    ports:
      - 8001:8001
    depends_on:
      - dynamodb-local
    networks:
      - local-dev-net # 修正

networks:
  local-dev-net:
    driver: bridge

volumes:
  dynamodb_data:
```

</details>

<details>
<summary> 2. あるネットワークに属するコンテナをチェックする方法</summary>

- 下記コマンドでインストール

```zh
   docker network inspect dynamodb-try_local-dev-net 
```

</details>