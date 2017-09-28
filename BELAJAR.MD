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

## Mapping function

```
var ids = users.map(function(user) { return user._id; });
```

## Reverse Populate

```
var reversePopulate = require('mongoose-reverse-populate');

var MT = this.ModelPhotoblogTransaction;
        this.ModelPhotoblogUser.find({_id:this.mongooseClient.Types.ObjectId("59390287ad89b52590dd74fe")}).select({ '_id': 1,'first_name':1,'last_name':1}).exec(function(err, users) {
            var opts = {
                modelArray: users,  //hasil find ModelPhotoblogUser
                storeWhere: "transaction", //nama properti dimana hasil populate diletakkan
                arrayPop: true,  //jika data pada hasil query ModelPhotoblogUser punya banyak relasi di model photoblog   transaction maka harus true agar resultnya berua array (intinya agar resultnya berbentuk array)
                mongooseModel: MT,  //model dimana foreign key dari this.ModelPhotoblogUser  terletak
                idField: "user_id"  //nama foreign key of user yang terletak di this.ModelPhotoblogTransaction
            }
        
            reversePopulate(opts, function(err, popAuthors) {
                popAuthors.forEach(function(item,index){
                  console.log(item.transaction);
                });
                console.log(popAuthors);
            });
        });
```

KETERANGAN : <br/>
Setelah proses reversePopulate, jika dijalankan perintah console.log(popAuthors) maka property <b>transaction</b> tidak akan muncul, tapi kalau popAuthors di forEach lalu lakukan perintah console.log(item.transaction) maka akan muncul.<br/>
ref: https://www.npmjs.com/package/mongoose-reverse-populate




## Where after populate mongoose

```
var _ = require('lodash');

this.ModelPhotoblogTransaction.find(
    query
  )
.populate({
  path: 'user_id',
  model: 'users',
  //match: { first_name:{$regex:"teach"}},
  select: { '_id': 1,'first_name':1,'last_name':1},
})
.exec(function(err,result){
  //Kalau find jadi object, kalau filter jadi array
  /*var rst =   _.find(result, function(o) { 
                return o.user_id.first_name == "1teacher"; 
              });*/
  var rst = _.filter(result, obj => { // --> /^aaa/ = "%aaa"    --> /^aaa&/ = "%aaa%"
    //return /1teache/.test(obj.user_id.first_name);

    var replace = query_name;
    var re = new RegExp(replace,"g");
    return re.test(obj.user_id.first_name);

  }); 
  // var ids = this.ModelPhotoblogUser.map(function(user) { return user._id; });
  //return resolve(rst);
});
```
