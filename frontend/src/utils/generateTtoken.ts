import CryptoJS from 'crypto-js';

export const removeIllegalCharacters = function (input: any) {
    return input.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const base64object = function (input: any) {
    var inputWords = CryptoJS.enc.Utf8.parse(JSON.stringify(input));
    var base64 = CryptoJS.enc.Base64.stringify(inputWords);
    var output = removeIllegalCharacters(base64);
    return output;
};

export const generateSignature = function (path: string, token_id: string, token_secret: string, oauth_request_private_id = null) {
    var header = { alg: 'HS256' };
    var payload = {
        path: path,
        oauth_request_private_id: oauth_request_private_id,
        token_id: token_id,
        nonce: Date.now(),
    };
    var unsignedToken = base64object(header) + '.' + base64object(payload);
    var signatureHash = CryptoJS.HmacSHA256(unsignedToken, token_secret);
    var signature = CryptoJS.enc.Base64.stringify(signatureHash);
    var token = unsignedToken + '.' + signature;
    var jwt = removeIllegalCharacters(token);
    return jwt;
};
