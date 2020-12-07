const express = require('express');
const router = express.Router();
require('./db')
const Agile = require('./Model');

// Basic CRUD operations

router.get('/', async (req, res) => {
  if(req.query.id) {
    if (!req.query.id || !req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({res: 'A MongoDB ID must be supplied!'})
    }
    let item = await Agile.findOne({_id: req.query.id})
    res.json({res: item})
  } else {
    let items = await Agile.find();
    res.json({res: items});
  }
});

router.post('/', async (req, res) => {
  if(req.body.type !== 'value' && req.body.type !== 'principle') {
    res.status(400).json({ res: 'Value "type" must be: "value" or "principle"' });
  } else {
    let request = {
      ...req.body
    }
    const createRequest = await Agile.create(request)
    res.status(201).json(createRequest)
  }
});

router.patch('/', async (req, res) => {
  if (!req.query.id || !req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({res: 'A MongoDB ID must be supplied!'})
  } else if(req.body.type !== 'value' && req.body.type !== 'principle') {
    res.status(400).json({ res: 'Value "type" must be: "value" or "principle"' });
  } else if (req.body.title === '' || req.body.content == '') {
    res.status(400).json({res: 'Must supply both title and content!'})
  } else {
    const updateRequest = await Agile.findOneAndUpdate(req.query.id, req.body, {new:true, useFindAndModify:true})
    res.json(updateRequest)
  }
})

router.delete('/', async (req, res) => {
  if(!req.query.id || !req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({res: 'A MongoDB ID must be supplied!'})
  } else {
    Agile.findOneAndDelete({_id: req.query.id})
    res.json({res: 'Resource deleted.'})
  }
})

router.post('/populate', async (req, res) => {
  if(req.query.clear === "true") {
    await Agile.deleteMany()
  }
  // Sample data taken from https://www.smartsheet.com/comprehensive-guide-values-principles-agile-manifesto
  const sampleData = require('./sampleData.json')
  await Agile.insertMany(sampleData)
  res.sendStatus(201)
});


router.delete('/clear', async (req, res) => {
  await Agile.deleteMany()
  res.json({res: 'Database cleared!'})
})


module.exports = router;