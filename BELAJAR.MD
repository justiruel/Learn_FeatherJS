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
