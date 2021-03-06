'use strict';

const service = require('feathers-mongoose');
const users = require('./users-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: users,
    paginate: {
      default: 5,
      max: 25
    }
  };

  //YOU CAN DEFINE YOUR OWN SERVICE
  //   class MyService {
  //     find(params) {}
  //     get(id, params) {}
  //     create(data, params) {}
  //     update(id, data, params) {}
  //     patch(id, data, params) {}
  //     remove(id, params) {}
  //     setup(app, path) {}
  //   }
  //  app.use('/my-service', new MyService());
 //IT JUST EXAMPLE

  // Initialize our service with any options it requires
  app.use('/users', service(options));

  // Get our initialize service to that we can bind hooks
  const usersService = app.service('/users');
  // Set up our before hooks
  usersService.before(hooks.before);

  // Set up our after hooks
  usersService.after(hooks.after);
};
