const crypto = require('crypto');
const https = require('https');
const moment = require("moment")
const mySignature = require('./SignatureUtils')

console.log('=====> step2 : Create Access Token');

//get privateKey from step1
const privateKeyStr = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1J8GgXaWb3mkwmrwobRMGUKoyoKNX9u8lB0Dw3Dyj/V1bj9aATWllKdPrMi33e1uJPNgyPoRncdu2VEUWvqXyyYYvi/Kd18huBFOjomTt3RfzWlGXhxGL25moApC6C1OdZkwNtlPHrqcO2GHncvaUiwK2TSAASmXNaMWp68leq+n4UupIPUNJ1CawK1XcEEhs1ZZRynzrt3d84O9A1rWuTsb7pLp2s0ugi5i78ymFKENQHgnK5FMGfzQr+XoexYdX/OeWDrZALDIi539tJ5FRcAqPx9rJLcdPgmSFvfMuKUBqZl2mYT0Es0Bb/J9Gbnxs5SJ5gVr2q3CObB0bolZ7AgMBAAECggEAOTBzWp6lxRbKS3tV8kc47dHyYShAWOlOZviqwj8s77JxUhIPLBMENlklm0cMpuftJl6se/QrlYKm06E37G3Ecui28XSzY6w3DLBV/T8rsMIPKRa20mjkG6x4jkc9DFa+D183nE6WlV/oQnICOnCbMprOAOJJO35BND8iw7l5qWaBbG8sGc3AhbzNPkMGLbMQZ7U1itb1+axWZFgmZ2/LUDbZg7nqZUxAiExmRh4oLiZazEiE4Ap49S3hbMyj1f9KCvzhOD84Px8iQfiN1fs0NlZ9opoA1CzFOeyF+VY2FrT5stYShWcUxDJdaKOT2fD5ySVdyNGZpgsatS8cY2lH8QKBgQDU/T2Xq53SIl0zB4+AbKxG5Uxo21dnMWdOttFvFsnlMqnbYwgcEtv/lkgTB7TK0WXm/wxANvoXXcsdE/tQ7akZ4vNxXH9TR6QkJJ0DZfdxH7T7+MssJ3QsDWYBCEiwaY+UnBKFRO0nvB/Fmnov0fpv2KNOCkWqQquYFiqvuFLaywKBgQDZvNGrqeUn8mjaPim7oKib8LPOoD83vzJek8fWPSofun42oK4c/G84VbSTzz/env1wLKA1s8Wxv8UA3msgNQA9izk1UxyqnWvVFi4ggfG6+RH8oO1odCJH2+QUFENY6tutpuVwXSCvJMQJqBN7pHoKj42pRhF1zDLdQsk7HuCNEQKBgFsqmnaVStRrSSFSlyYNXiBqfa5UVLEjAGk876BxTLICYZo6ZXo+yFQ6a1dZ8RTvVILvoLrLzXi6+PnVV7loQP2Hm1Rml0l6XNPrqBmQR73wKHPCJpUbviotAgBnH1YDmSWvOG469pgPejoGyU42vs+pFx2MYA1kxDYxJsxYRX7JAoGAB62P2zTPftwedGuyvwoISA9x17xw3j9gwFMHvfdEMAA8iSKbYSxJo7vp9ThesTP8DeOU9q/TLdRsVv6A2o7j5keticLXhPCuJ8Jzd/P9GTHFP5pRJNjLiKspXMfmJBGME5CKEK9IAsUSIKELptWC9DJhtXFiFjxQIttDC1Goa3ECgYAFkxvsVwsj9uDIFCOOrgl2Q5W+u/zApWKpVhGa2UqYW3SN2F+TaJsQ23N80HZgWmJaD0P7Bw3J+ljDjroc/5yMhHursIyveo3nJD8+sVJuhXLGLD+TS66NIgdt+vdcBBX/fKUkhytjfGuo5QNy19lma4Cpzz26RNXZcBMnBUpSzw==';
//get time
const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
const sandboxBaseUrl = 'sandbox-gateway.smilepayz.com';
const prodBaseUrl = 'gateway.smilepayz.com';

const postData = JSON.stringify({
  grantType: 'client_credentials'
});



function getAccessToken(clientKey){
  return new Promise((resolve,reject)=>{
    const accessTokenSignature = mySignature.accessTokenSignature(`${clientKey}`,timestamp,privateKeyStr)
    //options  you have changge hostname, timestamp, clientKey
    const options = {
      hostname: sandboxBaseUrl,
      port: 443,
      path: '/v1.0/access-token/b2b',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TIMESTAMP': timestamp,
        'X-CLIENT-KEY': `${clientKey}`,
        'X-SIGNATURE': accessTokenSignature
      }
    };

    const req2 = https.request(options, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      let data = '';
      res.on('data', (chunk) => {
        console.log(`Response Body: ${chunk}`);
        data += chunk;
      });
      res.on('end',()=>{
        const parsed = JSON.parse(data);
        resolve(parsed.accessToken);  //
      })
    });
    req2.write(postData);
    req2.end();
  })
}
module.exports = getAccessToken;

//********** end post ***************
