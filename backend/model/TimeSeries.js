const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timeSeriesSchema = new Schema({
    name: String,
    origin: String,
    destination: String,
    secret_key: String,
    timestamp: {
      type: Date,
      index: true 
    }
  });

module.exports=timeSeriesSchema

  
  