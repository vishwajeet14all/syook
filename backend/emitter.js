const io = require('socket.io-client');
const data = require('./data.json');
const encryptionkey = require('./encryptionkey');
const fakekey =require('./Test/Fakekey')
const {generateEncryptedMessage}=require('./utils')
const socket = io.connect('http://localhost:4000');



socket.on('connect', () => {
  console.log('Emitter connected to listener');

  setInterval(() => {
    const encryptedMessageStream = generateEncryptedMessage(data,encryptionkey);

    socket.emit('encryptedDataStream', encryptedMessageStream);
  }, 10000); // Send every 10 seconds
  // const encryptedMessageStream = generateEncryptedMessage(data,encryptionkey);

  // socket.emit('encryptedDataStream', encryptedMessageStream);
  //test case

});


