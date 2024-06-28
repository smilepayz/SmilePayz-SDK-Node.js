const crypto = require('crypto');
const https = require('https');
const getAccessToken = require('./step2_accessToken')
const mySignature =require('./SignatureUtils')
const moment = require("moment/moment");
const { v4: uuidv4 } = require('uuid');


console.log('=====> step2 : Create Access Token');

const merchantSecret = '1c10756efe3494660442cdc096d402c154bae5d32a4c31fec087b38bc6ad5a29';
const sandboxBaseUrl = 'sandbox-gateway.smilepayz.com';
const prodBaseUrl = 'gateway.smilepayz.com';

async function payInRequest(clientKey,minify){
    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');

    const token = await getAccessToken(`${clientKey}`);

    const hash = crypto.createHash('sha256').update(`${minify}`).digest();
    const byte2Hex = hash.toString('hex');
    const lowerCase = byte2Hex.toLowerCase();
    const signData = 'POST:/v1.0/transaction/pay-in:' + `${token}` + ':' +  lowerCase + ':' + timestamp;
    const signature = mySignature.hmacSHA512(signData, merchantSecret);

    console.log(`Response Body: ${token}`)
    //options  you have changge hostname, timestamp, clientKey
    const options = {
        hostname: sandboxBaseUrl,
        port: 443,
        path: '/v1.0/transaction/pay-in',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-TIMESTAMP': timestamp,
            'X-EXTERNAL-ID': uuidv4(),
            'CHANNEL-ID': `${clientKey}`,
            'X-SIGNATURE': signature,
            'X-PARTNER-ID': `${clientKey}`
        }
    };

    //post request
    const req = https.request(options, (res) => {
        console.log(`Status Code: ${res.statusCode}`);

        res.on('data', (chunk) => {
            console.log(`Response Body: ${chunk}`);
        });
    });

    req.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });

    req.write(minify);
    req.end();
}
//get merchantId from merchant platform
const payInParam = {
    paymentMethod: 'PIX',
    payer: {
        name: 'payer name',
        phone: '12345678'
    },
    receiver:{
        name: 'payer name',
        phone: '12345678'
    },
    orderNo: 'T_1713176994197',
    purpose: 'test',
    productDetail: 'details',
    itemDetailList: [
        {
            name: "mac",
            quantity: 1,
            price: 100
        }
    ],
    billingAddress: {
        address: 'Ayu 1 No.B1 Pluit',
        city: 'jakarta',
        postalCode: '14450',
        phone: '018922990',
        countryCode: 'BRAZIL',
    },
    shippingAddress: {
        address: 'Ayu 1 No.B1 Pluit',
        city: 'jakarta',
        postalCode: '14450',
        phone: '018922990',
        countryCode: 'BRAZIL',
    },
    money:{
        currency: 'BRL',
        amount: 100,
    },
    merchant:{
        merchantId: 'sandbox-20011'
    },
    area: 13
}
const minify = JSON.stringify(payInParam);
payInRequest('sandbox-20011',minify);

//********** end post ***************
