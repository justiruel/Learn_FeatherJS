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
var ids = users.map(function(item,index) { return item._id; });
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

kecuali menggunakan lean, contoh :

```
find({}).lean().exec(function(err, users) {}
```
maka property <b>transaction</b> akan muncul <br/>
ref : https://stackoverflow.com/a/14510823





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

## Menggunakan bluebird promise

```
const Promise = require('bluebird');

var tmp;     
return Promise
.all([
	perintah1,
	perintah2,
	perintah3,
])
.then(function (results) {
	const hasilperintah1 = results[0];
	const hasilperintah2 = results[1];
	const hasilperintah3 = results[2];
	tmp = proses_utama(hasilperintah1,hasilperintah2,hasilperintah3);
	return true;
})
.then(parameterArrowFunction => {
	return tmp+xyz;	
})
.then(function(results){
    	res.send("sukses!");
})
.catch(err => {
	console.log(err);
	console.log(err.stack);
	// throwing error is important. Otherwise promise will be resolved with value returned
	// by this function (undefined) and next `.then()` callback in the chain will be executed
	throw err;
});
```

## Mongoose -> Find 

```
this.ModelPhotoblogTransaction.find({}, function (err, result) {
              if (err) return reject(err);               
              return resolve(result);
});
```

## Mongoose -> Find -> where $and statement

```
         
this.ModelPhotoblogTransaction.find({
  $and:[
    {schoolcode: {$regex:params.query.schoolcode}},
    {title: {$regex:params.query.title}},
    {status: {$regex:params.query.status}},

  ]
  //schoolcode: {$regex:params.query.schoolcode}   // --> /a/   =  %a% -> like  | regex == like in sql
}, function (err, result) {
  if (err) return reject(err);
  return resolve(result);
});
        
```

## Mongoose -> Save

```
var photoblog = this.options.Model; //manual model
var pb = new photoblog({ //manual model
linkfile: 'asek' 
});
pb.save(function (err, results) { //manual model
console.log(results._id);
});
```

## Mongoose -> Update

```
this.ModelPhotoblogTransaction.findOneAndUpdate({
  _id: this.mongooseClient.Types.ObjectId(params.query.id)},
  {$set:{status:params.query.status}},
  {new: true}, function(err, results){
    if(err) console.log(err);           
    var reslt = {};
    reslt.status = 200;
    reslt.data = results;
    return resolve(reslt);
});

```
ket. : new: bool - if true, return the modified document rather than the original. defaults to false (changed in 4.0)
ref : https://stackoverflow.com/a/32811548


## Agar result dari mongoose dapat di modifikasi
gunakan .lean() contoh :

```
find({}).lean().exec(function(err, users) {}
```
ref: https://stackoverflow.com/a/14510823



## How to use a variable as a field name in mongodb/mongoose
```
var name=req.params.name;
var value = req.params.value;
collection.findOne({[name]:value}, function(err, item) {
res.send(item);
});
```
