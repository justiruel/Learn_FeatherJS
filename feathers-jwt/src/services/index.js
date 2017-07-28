'use strict';

const login = require('./login');
const users = require('./users');
const mongoose = require('mongoose');
module.exports = function() {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;
  app.configure(users);
  app.configure(login);
};
