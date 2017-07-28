//{{url}}logins?jon=sena&ada=123&sukses=1
'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const users = require('../../users/users-model');


exports.before = {
  all: [],
  find: [
    function(hook) {
      console.log('hook before',hook.params);
      hook.params.query.ada = "asa"  

      if (hook.params.query.sukses != 1){
        hook.result = "You fail to get the data!";  //lempar message
      }
      
    }
  ],
  get: [ //{{url}}/1   ==> 1 = data
  function(hook) {
      hook.app.service('logins').methodku();  //contoh run method dari service lain
  }
    
      
  ],    
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
