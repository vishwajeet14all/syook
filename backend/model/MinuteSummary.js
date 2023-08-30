const mongoose = require('mongoose');

const minuteSummarySchema = new mongoose.Schema({
    hour: Number,
    minute:Number,
  Data: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSeries',
    },
  ],
  // Other aggregated fields as needed
});

module.exports = minuteSummarySchema;
