// ==========================================================================
// List Schema
// ==========================================================================
'use strict';

var mongoose = require('mongoose');

var listSchema = mongoose.Schema({
                  name: String,
                  items: [{
                    body: String,
                    active: Boolean,
                    _id: mongoose.Schema.Types.ObjectId,
                    added: { type: Date, default: Date.now }
                  }],
                  date: { type: Date, default: Date.now }
                });

module.exports = mongoose.model('List', listSchema);
