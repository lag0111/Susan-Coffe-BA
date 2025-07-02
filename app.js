var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}


const mogoose = require('mongoose');
require('./model/productModel')
// require('./model/thuonghieuModel')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product')
var categoriesRouter = require('./routes/categorie')
var orderRouter = require('./routes/order')
// var thuonghieusRouter = require('./routes/thuonghieu')
// var chatlieusRouter = require('./routes/chatlieu')
// var cartRouter = require('./routes/cart')

var app = express();

mogoose.connect('mongodb+srv://thuan01112003:thuandz123@cluster0.khf1y.mongodb.net/susan-coffee')
  .then(() => console.log('kết nối đến vệ tinh thành công ❤️ ❤️'))
  .catch(err => console.log('không thể kết nối đến hành tinh ',err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product',productRouter);
app.use('/categories',categoriesRouter);
app.use('/order',orderRouter);
// app.use('/thuonghieu',thuonghieusRouter);
// app.use('/chatlieu',chatlieusRouter);
// app.use('/cart',cartRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
