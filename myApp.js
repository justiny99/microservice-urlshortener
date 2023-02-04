require('dotenv').config();
const nanoid = require('nanoid');
const dns = require('dns');
const URL = require('url').URL;
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
    default: () => nanoid()
  }
})

let Url = mongoose.model('Url', urlSchema);