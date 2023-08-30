const crypto = require('crypto');
const express=require('express')
const app=express();
const cors=require('cors')
const http=require('http')
app.use(cors())
const server=http.createServer(app);
server.listen(4000,()=>console.log('server is on'))
const {Server} = require('socket.io'); 
const encryptionkey = require('./encryptionkey');
const {TimeSeriesModel,MinuteSummaryModel}=require('./connector')
const {validatePayload} =require('./utils')
const io= new Server(server,{
  cors:{
    origin:["http://localhost:3000","https://timeseriesfrontend.onrender.com"]

  }
})
// Replace with your MongoDB connection URL
io.on('connection', (socket) => {
  console.log('Listener connected to emitter');

  socket.on('encryptedDataStream', async (encryptedMessage) => {
   let totalcount=0
    let successcount=0
    let errorcount=0
    try {
      // console.log(encryptedMessage,'message encrypted is')
     const encryptedMessages = encryptedMessage.split('|');
     totalcount=encryptedMessages.length
     let totalmessages =encryptedMessages.length
      for (const encryptedMessage of encryptedMessages){
       
      const ivHex = encryptedMessage.substr(0, 32);
       // Extract the first 32 characters as IV in hex
       const iv = Buffer.from(ivHex, 'hex');
      // console.log(iv)
      const encryptedPayload = encryptedMessage.substr(32); // The remaining part is the encrypted payload

      const decipher = crypto.createDecipheriv('aes-256-ctr', encryptionkey,iv);

      let decryptedPayloadBuffer = Buffer.concat([decipher.update(Buffer.from(encryptedPayload, 'hex')), decipher.final()]);

      const payload = JSON.parse(decryptedPayloadBuffer.toString());

// console.log(payload,'my payload is')
      // Validate payload and save to MongoDB
      if (validatePayload(payload)) {
        try{
        await saveToMongo(payload);
        successcount++
        io.emit('success',{payload})
        console.log('Valid payload saved:', payload);
      }
      catch(err){
console.log('error saving the data to mongodb')

      }

       
      } else {
        console.log('Invalid payload:', payload);
        io.emit('error',{message:"payload is corrupted"})
       errorcount++
      }
    }
    } catch (error) {
      errorcount++
      console.error('Error decrypting or processing payload:', error.message);
      io.emit('error',{message:error.message})
    
    }
    io.emit('log',{successcount,errorcount,totalcount})
  });
});


const saveToMongo = async (payload) => {
  let currentTime= new Date()
  const currentMinute = currentTime.getMinutes();
  const currentHour = currentTime.getHours();
  const timeSeriesData = new TimeSeriesModel({
    name: payload.name,
    origin: payload.origin,
    destination: payload.destination,
    secret_key: payload.secret_key,
    timestamp: currentTime
  });
  try{
    const data=await timeSeriesData.save( )
    const existingSummary = await MinuteSummaryModel.findOne({ hour:currentHour,minute: currentMinute });

    if (existingSummary) {
      existingSummary.Data.push(data._id);
     const saved= await existingSummary.save();
     console.log('saved is ',saved)
    } else {
      const newSummary = new MinuteSummaryModel({
        hour:currentHour,
        minute: currentMinute,
        Data: [data._id],
      });
      await newSummary.save();
    }

  }
  catch(err){
    console.log('error in inserting to database',err)
  }
};
