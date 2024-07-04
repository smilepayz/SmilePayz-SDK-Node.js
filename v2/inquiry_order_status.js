const https = require('https');
const mySignature = require('../SignatureUtils')
const moment = require("moment/moment");
const {v4: uuidv4} = require('uuid');
const myContants = require('./ContantsV2')

async function inquiryOrderStatus(merchantId, merchantSecret, baseDomain) {
    //get merchantId from merchant platform
    const inquiryOrderStatusReq = {
        tradeType: '2',
        tradeNo: '112200182402261848252600',
        orderNo: 'D_1708948105016'
    }
    const minify = mySignature.minify(inquiryOrderStatusReq);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' + merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData, myContants.PRIVATE_KEY)

    //options  you have changge hostname, timestamp,
    const options = {
        hostname: baseDomain,
        port: 443,
        path: '/v2.0/inquiry-status',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-TIMESTAMP': timestamp,
            'X-SIGNATURE': signature,
            'X-PARTNER-ID': merchantId
        }
    };
    console.log(`request path: ${options.hostname + options.path}`);

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


const merchant_secret_sandbox = "6a58a603e5043290f4097ee4a7745661b3656932d4eebc3106b5dddc3af6e053";
const merchant_secret = "95b57c46b8c2e068982be23fb669a80612cad68e6ce6ba4f5af9ec20d23bb274";
const sandboxMerchanteId = "sandbox-20019";
const merchanteId = "20019";
const sandboxBaseDomain = "sandbox-gateway-test.smilepayz.com";
const baseDomain = "gateway-test.smilepayz.com";
inquiryOrderStatus(myContants.MERCHANT_ID, myContants.MERCHANT_SECRET, myContants.BASE_URL);

//********** end post ***************
