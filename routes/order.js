var express = require('express');
var orderModel = require('../model/orderModel');
var categoriesModel = require('../model/categoriesModel')
var router = express.Router();
var cors = require('cors');
const mongoose = require('mongoose');
// const multer  = require('multer')
// const upload = multer({ dest: '../uploads/' })



var app = express();

const corsOptions = {
  origin: 'http://localhost:4000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// app.use(cors());

// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions = { origin: true };
//   callback(null, corsOptions);
// };

// const corsOptions = {
//   origin: 'http://localhost:5000', // Đường dẫn của client
//   optionsSuccessStatus: 200 // Trạng thái HTTP thành công cho phương thức OPTIONS
// };

// const corsOptionsDelegate = function (req, callback) {

//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true }; // Cho phép truy cập từ nguồn gốc được phép
//   } else {
//     corsOptions = { origin: false }; // Từ chối truy cập từ nguồn gốc không được phép
//   }
//   callback(null, corsOptions);
// };


/* GET users listing. */

router.get('/', cors(corsOptions), async function (req, res, next) {
  try {
    const data = await orderModel.find();
    res.json(data);
  } catch (error) {
    res.json({ status: false });
  }
});
router.post('/', cors(corsOptions), async function (req, res, next) {
  try {
    const { user, detail, total_money } = req.body;
    const newOrder = {
      _id: null,
      user: {
        fullname: user.fullname,
        phone: user.phone,
        address: user.address,
      },
      detail,
      total_money: total_money,
    };

    const data = await orderModel.create(newOrder);
    res.status(200).json({ status: true, message: "Order created successfully" });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ status: false, message: `Error creating order: ${error.message}` });
  }
});



module.exports = router;