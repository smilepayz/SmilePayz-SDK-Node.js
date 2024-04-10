const crypto = require('crypto');

function hmacSHA512(signData, secret) {

    const hmac = crypto.createHmac('sha512', secret);

    hmac.update(signData);

    return hmac.digest('base64');
}
const minify = "{\"paymentMethod\":\"QRPAY\",\"payer\":{\"name\":\"payer name\",\"phone\":\"123456789\"},\"receiver\":{\"name\":\"receiver name\",\"phone\":\"123456789\"},\"orderNo\":\"T_1712742988888\",\"purpose\":\"Purpose For Transaction from Java SDK\",\"productDetail\":\"Product details\",\"itemDetailList\":[{\"name\":\"mac A1\",\"quantity\":1,\"price\":100}],\"billingAddress\":{\"address\":\"Jl. Pluit Karang Ayu 1 No.B1 Pluit\",\"city\":\"jakarta\",\"postalCode\":\"14450\",\"phone\":\"018922990\",\"countryCode\":\"THAILAND\"},\"shippingAddress\":{\"address\":\"Jl. Pluit Karang Ayu 1 No.B1 Pluit\",\"city\":\"jakarta\",\"postalCode\":\"14450\",\"phone\":\"018922990\",\"countryCode\":\"THAILAND\"},\"money\":{\"currency\":\"THB\",\"amount\":100},\"merchant\":{\"merchantId\":\"sandbox-20011\"},\"area\":11}";

const hash = crypto.createHash('sha256').update(minify).digest();
const byte2Hex = hash.toString('hex');
const lowerCase = byte2Hex.toLowerCase();

const accessToken = "gp9HjjEj813Y9JGoqwOeOPWbnt4CUpvIJbU1mMU4a11MNDZ7Sg5u9a";
const timestamp = "2020-12-17T10:55:00+07:00";
const signData = "POST:/v1.0/transaction/pay-in:" +accessToken  +  lowerCase + timestamp;
const secret = "1c10756efe3494660442cdc096d402c154bae5d32a4c31fec087b38bc6ad5a29";

const signature = hmacSHA512(signData, secret);

console.log(signature);


