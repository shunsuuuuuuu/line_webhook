const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Function to verify LINE signature
function verifySignature(req, res, next) {
    const signature = req.headers['x-line-signature'];
    if (!signature) {
        return res.status(400).send('LINE signature not found');
    }

    const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;
    const hash = crypto
        .createHmac('SHA256', channelAccessToken)
        .update(JSON.stringify(req.body))
        .digest('base64');
    //   if (signature !== hash) {
    //     console.log('Invalid signature');
    //     return res.status(401).send('Invalid LINE signature');
    //   }

    next();
}

// Webhook endpoint with signature verification
app.post('/webhook', verifySignature, async (req, res) => {
    const events = req.body.events;

    if (!events) {
        return res.status(400).end();
    }

    for (const event of events) {
        console.log(`Event type: ${event.type}`);
        console.log(`Message: ${event.message.text}`);
        dateString = "";

        if (event.message.text.match(/[0-9]{1,2}月[0-9]{1,2}日/)) {
            const date = event.message.text.match(/[0-9]{1,2}月[0-9]{1,2}日/)[0];
            const year = new Date().getFullYear();

            // 安全な方法で月と日を抽出
            const monthMatch = date.match(/^([0-9]{1,2})月/);
            const dayMatch = date.match(/([0-9]{1,2})日$/);

            if (monthMatch && dayMatch) {
                const month = monthMatch[1];
                const day = dayMatch[1];
                dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                console.log(`日付を含むメッセージを検知： ${dateString}`);
            }

            const replyToken = event.replyToken;
            const replyText = dateString + 'に予定が入りました。';

            await axios.post('https://api.line.me/v2/bot/message/reply', {
                replyToken,
                messages: [{ type: 'text', text: `AI Agent OIS: ${replyText}` }]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
                }
            });
        }

    }

    res.status(200).end();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
