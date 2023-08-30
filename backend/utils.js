const crypto = require('crypto');
const generateRandomIndex = (max) => Math.floor(Math.random() * max);
const generateRandomData =(data)=> data[generateRandomIndex(data.length)];
const generateEncryptedMessage = (data,encryptionkey) => {
  const messageCount = Math.floor(Math.random() * (499 - 49 + 1)) + 49;
  const encryptedMessages = [];

  for (let i = 0; i < messageCount; i++) {
    console.log(messageCount,'my message count')
    const randomData = {
      name: generateRandomData(data.names),
      origin: generateRandomData(data.cities),
      destination: generateRandomData(data.cities)
    }
    const jsonString = JSON.stringify(randomData);
    const hash = crypto.createHash('sha256').update(jsonString).digest('hex');
    randomData.secret_key = hash;

    const jsonWithSecretKey = JSON.stringify(randomData);
    const iv = crypto.randomBytes(16);
    console.log(iv)
    const cipher = crypto.createCipheriv('aes-256-ctr',encryptionkey,iv);
    let encryptedMessage = cipher.update(jsonWithSecretKey, 'utf8', 'hex');
    encryptedMessage = iv.toString('hex')+cipher.final('hex')+encryptedMessage
   
    encryptedMessages.push(encryptedMessage);
  }

  return encryptedMessages.join('|');
};
const validatePayload = (payload) => {
    // Implement your payload validation logic here
    // For example, you can compare the hash of the payload with the secret_key
    console.log('payload is',payload)
    const calculatedSecretKey = crypto.createHash('sha256').update(JSON.stringify({
      name:payload.name,
      origin:payload.origin,
      destination:payload.destination
    })).digest('hex');
    return calculatedSecretKey === payload.secret_key;
  };
exports.generateEncryptedMessage=generateEncryptedMessage;
exports.validatePayload=validatePayload;