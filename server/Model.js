const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const AgileSchema = new Schema({
  title: String,
  content: String,
  type: String
});

const Agile = mongoose.model('Agile', AgileSchema);

module.exports = Agile;