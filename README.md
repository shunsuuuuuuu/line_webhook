# LINE_webhook
LINEのトーク内容を解析するためのプログラムです。

## 環境構築
```
npm init -y
npm install express body-parser @line/bot-sdk
sudo npm install -g ngrok
```

## 設定
### LINE Developers の登録
[LINE Developers](https://developers.line.biz/)にアクセスしてログインし、チャネルを作成します。
- チャネルの種類は「Messaging API」を選択。
- 必要な情報（名前、アイコンなど）を入力して作成。

### チャネルアクセストークンの取得
チャネルの設定画面から「Messaging API設定」を選択し、「チャネルアクセストークン」を発行します。
コピーして、.envファイルに貼り付けてください。

### Webhook URLを設定
[ngrok](https://dashboard.ngrok.com)を利用して、サーバーをインターネット上で公開します。  
アカウントを登録し、ログインします。 「Your Authtoken」 タブを開き、Authtokenをコピーします。以下のコマンドでトークンを登録します。
```
ngrok config add-authtoken <your_authtoken>
```
続いて、以下のコマンドでngrokを起動します。
```
ngrok http 3000
```
を実行すると以下のような表示が出るので、https://xxxx-xxxx-xxxx.ngrok-free.app の部分をコピーして、LINE DevelopersのWebhook URLに設定します。
```
Sign up to try new private endpoints https://ngrok.com/new-features-update?ref=privat

Session Status                online                                                 
Account                       shunsuuuuuu (Plan: Free)                               
Version                       3.19.0                                                 
Region                        Japan (jp)                                             
Latency                       29ms                                                   
Web Interface                 http://127.0.0.1:4040                                  
Forwarding                    https://333d-116-222-156-59.ngrok-free.app -> http://localhost:3000
```
                                
## 実行
ngrokを起動した状態で、サーバーを起動します。
```
node app.js
```

LINEのアカウントにメッセージを送ると、解析された結果が出力されます。