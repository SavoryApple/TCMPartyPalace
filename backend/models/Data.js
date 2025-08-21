const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  key: String,
  value: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Data', DataSchema);