var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel')
const bcrypt = require('bcryptjs');
var cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer')
const jwt = require('jsonwebtoken');


var app = express();

const corsOptions = {
  origin: 'http://localhost:4000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));


let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
function checkFileUpLoad(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Bạn chỉ được upload file ảnh'));
  }
  cb(null, true);
}
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad, limits: { fileSize: 50 * 1024 * 1024 } });

/* GET users listing. */
router.get('/', cors(corsOptions), async function (req, res, next) {
  try {
    const data = await userModel.find();
    res.json(data);
  } catch (error) {
    res.json({ status: false });
  }
});
router.get('/_id/:id', cors(corsOptions), async function (req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);
    const data = await userModel.findById(id);
    if (data) {
      res.json(data);
      console.log('Fetched data: ', data);
    } else {
      res.status(404).json({ status: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
});

router.post('/', cors(corsOptions), async function (req, res, next) {
  try {
    const { _id, fullname, username, phone, email, address, password } = req.body;
    const user = await userModel.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const data = await userModel.create({
        _id: null,
        fullname,
        username,
        phone,
        email,
        address,
        password: hashPassword,
        role:'user'
      });
      res.status(200).json({ status: true, message: "Đăng ký tài khoản thành công" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Đăng ký tài khoản thất bại" });
  }
});

router.post('/login', cors(corsOptions), async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await userModel.findOne({ username });
    if (!data) {
      return res.status(404).json({ status: false, message: 'Tài khoản không tồn tại' });
    }

    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      return res.status(400).json({ status: false, message: 'Mật khẩu không chính xác' });
    }

    const token = jwt.sign({ username: data.username, admin: data.admin }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Đăng nhập thất bại' });
  }
});
router.get('/checktoken', async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Received token:', token); // Log token nhận được

  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token" });
  }

  jwt.verify(token, 'secret', (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
    res.status(200).json({ message: "Token hợp lệ" });
  });
});

router.get('/detailuser', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token" });
  }

  jwt.verify(token, 'secret', async (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
    
    console.log('Verified user:', user); 
    
    try {
      const userInfo = await userModel.findOne({ username: user.username });
      if (userInfo) {
        res.status(200).json(userInfo);
      } else {
        res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
    } catch (dbError) {
      console.error('Database error:', dbError); 
      res.status(500).json({ message: "Lỗi khi truy xuất dữ liệu", error: dbError.message });
    }
  });
});

module.exports = router;
