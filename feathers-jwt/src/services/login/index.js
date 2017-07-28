//{{url}}logins?jon=sena&ada=123&sukses=1
'use strict';

const hooks = require('./hooks');
const users = require('../users/users-model');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    //return Promise.resolve(params.query.sum); /{{url}}?sum=
    //return Promise.resolve([]);
     console.log('service',params);
     var x= users.find({}).exec().then(function (hasil) {
       const arr = {
         username:hasil[0].user,
         password:hasil[0].pass
       }
       return arr;
     });
     return Promise.resolve(x); //cetak di layar
  }

  methodku(){
    console.log("ini method di service login");
  }

  get(id, params) { //{{url}}logins/1  --> 1 = id
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {  //POST
    if(Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

//

  update(id, data, params) { //put = update (all field dalam table)
    return Promise.resolve(data);
  }

  patch(id, data, params) { //patch = partial update (partial field dalam table)
    return Promise.resolve(data);
  }

  remove(id, params) { //delete
    return Promise.resolve({ id });
  }
}

module.exports = function(){ //agar bisa di import const login = require('./login');
  const app = this;

  // Initialize our service with any options it requires
  app.use('/logins', new Service());

  // Get our initialize service to that we can bind hooks
  const loginService = app.service('/logins');

  // Set up our before hooks
  loginService.before(hooks.before);

  // Set up our after hooks
  loginService.after(hooks.after);
};

module.exports.Service = Service;
