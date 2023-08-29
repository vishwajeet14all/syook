const io = require('socket.io-client');
const crypto = require('crypto');
const data = require('./data.json');
const encryptionkey = require('./encryptionkey');

const socket = io.connect('http://localhost:3000'); // Listener's address

const generateRandomIndex = (max) => Math.floor(Math.random() * max);
const generateRandomData =(data)=> data[generateRandomIndex(data.length)];
const generateEncryptedMessage = () => {
  const messageCount = Math.floor(Math.random() * (499 - 49 + 1)) + 49;
  const encryptedMessages = [];

  for (let i = 0; i < messageCount; i++) {
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

socket.on('connect', () => {
  console.log('Emitter connected to listener');

  setInterval(() => {
    const encryptedMessageStream = generateEncryptedMessage();

    socket.emit('encryptedDataStream', encryptedMessageStream);
  }, 10000); // Send every 10 seconds
});

