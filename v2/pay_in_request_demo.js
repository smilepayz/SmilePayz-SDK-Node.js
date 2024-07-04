const crypto = require('crypto');
const https = require('https');
const mySignature =require('../SignatureUtils')
const moment = require("moment/moment");
const { v4: uuidv4 } = require('uuid');
const myContants = require('./ContantsV2')

async function payInRequest(merchantId,merchantSecret,baseDomain){
    const orderNo = myContants.MERCHANT_ID + mySignature.generateRandomString(16);
    //get merchantId from merchant platform
    const payInParam = {
        orderNo: orderNo.substring(0,32),
        purpose: 'demo for node.js',
        paymentMethod: 'W_DANA',
        money:{
            currency: myContants.INDONESIA_CURRENCY,
            amount: 100000,
        },
        merchant:{
            merchantId: merchantId
        },
        area: myContants.INDONESIA_CODE,
        //Conditional Mandatory
        additionalParam: {
            //Only for Thailand pay in which method is BANK,this is means your paying bank account no
            // payerAccountNo: '3456432',
        },
        //below field is optional
        payer: {
            name: 'payer name',
            phone: '12345678'
        },
        receiver:{
            name: 'payer name',
            phone: '12345678'
        },
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
            countryCode: '111111',
        },
        shippingAddress: {
            address: 'Ayu 1 No.B1 Pluit',
            city: 'jakarta',
            postalCode: '14450',
            phone: '018922990',
            countryCode: '111111',
        }
    }
    const minify = JSON.stringify(payInParam);
    console.log(`minify String: ${minify}`);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' +  merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData,myContants.PRIVATE_KEY)

    //options  you have changge hostname, timestamp,
    const options = {
        hostname: baseDomain,
        port: 443,
        path: '/v2.0/transaction/pay-in',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-TIMESTAMP': timestamp,
            'X-SIGNATURE': signature,
            'X-PARTNER-ID': merchantId
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

payInRequest(myContants.MERCHANT_ID,myContants.MERCHANT_SECRET,myContants.BASE_URL);

//********** end post ***************
