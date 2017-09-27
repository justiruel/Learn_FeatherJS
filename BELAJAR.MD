##  Set agar middleware harus melewati authentikasi (FeathersJS)

```
//ref: https://github.com/feathersjs/feathers-authentication/issues/495
const auth = require('feathers-authentication');
app.use(
'/photoblog/upload',
auth.express.authenticate('jwt'),
(req, res,next) => {
  next();
    //res.render('home');
    //res.send("sdsd");
});
```

##  Custom Result dari proses authentikasi, bisa juga digunakan untuk custom authorisasi

```
const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');

module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local(config.local));


  //CUSTOM AUTHORIZATION
  //ref: https://legacy.docs.feathersjs.com/authorization/readme.html
  var customAuth = function(options = {}) {
    return function(hook) {
      //console.log(hook.result);
      var result = {};
      result["user_id"] = hook.params.user._id;
      result["schoolcode"] = hook.params.user.schoolcode;
      result["accessToken"] = hook.result.accessToken;

      hook.result = result;
    };
  };
  //END OF CUSTOM AUTHORIZATION


  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    },
    after: {
      create: [
        customAuth()
      ],
    }
  });
};

```

## Join Populate tanpa register ref di schema

```
var query={};
this.ModelPhotoblogTransaction.find(
            query
          ).populate({
          path: 'user_id',
          model: 'users',
          select: { '_id': 1,'first_name':1,'last_name':1},
        }).exec(function(err,result){
          return resolve(result);
        });
```
