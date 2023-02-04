require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const nanoid = require('nanoid');
const dns = require('dns');
const URL = require('url').URL;

// mongoose stuff
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

// set up model/schema for the url
const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: String,
    default: () => nanoid.nanoid()
  }
})

let Url = mongoose.model('Url', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// My code here
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;
  const urlObj = new URL(originalUrl);
  dns.lookup(urlObj.hostname, (err, address, family) => {
    if (err) {
      res.json({error: 'invalid url'});
    }
    else {
      let data = new Url({
        original_url: originalUrl,
      });
      data.save(function(err, data) {
        if (err) console.log(err);
      });

      res.json(data);
    }
  });
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  Url.findOne({short_url: req.params.shorturl}, (err, urlFound) => {
    if (err) return console.log(err);
    return res.redirect(urlFound.original_url);
  });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
