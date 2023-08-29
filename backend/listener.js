const crypto = require('crypto');
const io = require('socket.io')(3000); // Replace with your desired port
const MongoClient = require('mongodb').MongoClient;
const encryptionkey = require('./encryptionkey');

// Replace with your MongoDB connection URL
const mongoURL = 'mongodb+srv://mdsaleem516:a4dtNSbNPV1KOFHh@cluster0.npkfbjc.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'timeseriesDB'; // Replace with your database name

io.on('connection', (socket) => {
  console.log('Listener connected to emitter');

  socket.on('encryptedDataStream', (encryptedMessage) => {
    try {
      
      const ivHex = encryptedMessage.substr(0, 32);
       // Extract the first 32 characters as IV in hex
       const iv = Buffer.from(ivHex, 'hex');
      console.log(iv)
      const encryptedPayload = encryptedMessage.substr(32); // The remaining part is the encrypted payload

      const decipher = crypto.createDecipheriv('aes-256-ctr', encryptionkey,iv);

      let decryptedPayloadBuffer = Buffer.concat([decipher.update(Buffer.from(encryptedPayload, 'hex')), decipher.final()]);

      const payload = JSON.parse(decryptedPayloadBuffer.toString());


      // Validate payload and save to MongoDB
      if (validatePayload(payload)) {
        saveToMongo(payload);
        console.log('Valid payload saved:', payload);
      } else {
        console.log('Invalid payload:', payload);
      }
    } catch (error) {
      console.error('Error decrypting or processing payload:', error.message);
    }
  });
});

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

const saveToMongo = async (payload) => {
  try {
    const client = await MongoClient.connect(mongoURL);
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('timeseries');

    const currentTime = new Date();
    payload.timestamp = currentTime.toISOString();

    const result = await collection.insertOne(payload);
    console.log('Document inserted:', result);

    client.close();
  } catch (error) {
    console.error('Error connecting to or inserting into MongoDB:', error.message);
  }
};
