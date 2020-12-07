const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/agile', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
const db = mongoose.connection;
module.exports = db