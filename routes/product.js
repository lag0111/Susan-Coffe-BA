var express = require('express');
var productModel = require('../model/productModel');
var categoriesModel = require('../model/categoriesModel')
var router = express.Router();
var cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer')
// const upload = multer({ dest: '../uploads/' })



var app = express();

const corsOptions = {
  origin: '*',
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
    const data = await productModel.find();
    res.json(data);
  } catch (error) {
    res.json({ status: false });
  }
});

// Định nghĩa route để lấy sản phẩm dựa trên _id
// router.get('/_id/:id', async function(req, res, next) {
//   try {
//     const {id} = req.params;
//     console.log(id);
//     const data = await productModel.find({ "_id": id });
//     res.json(data);
//     console.log('lấy về id'+data);
//   } catch (error) {
//     res.json({status:false});
//   }
// }); hàm này nó đang lấy về 1 mảng bao gồm các object 

router.get('/_id/:id', cors(corsOptions), async function (req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);
    const data = await productModel.findById(id);
    if (data) {
      res.json(data);
      console.log('Fetched data: ', data);
    } else {
      res.status(404).json({ status: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
});

router.get('/cateid/:id', cors(corsOptions), async function (req, res, next) {
  try {
    const id = req.params.id;
    console.log(id);
    // const objectId = new mongoose.Types.ObjectId(id);
    const data = await productModel.find({ categoryId: id });
    if (data) {
      res.json(data);
      console.log('Fetched data: ', data);
    } else {
      res.status(404).json({ status: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
});

router.get('/nameCate/:id', cors(corsOptions), async function (req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);
    const data = await productModel.findById(id);

    if (data) {
      const cateId = data.categoryId;
      try {
        const nameCate = await categoriesModel.findById(cateId);

        if (nameCate) {
          return res.json({ name: nameCate.name });
        } else {
          return res.status(404).json({ status: false, message: 'Category not found' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
      }
    } else {
      return res.status(404).json({ status: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
});



router.get('/nameCategories', async (req, res) => {
  try {
    const categoriesData = await categoriesModel.find();
    const categoriesMap = categoriesData.reduce((map, categories) => {
      map[categories._id] = categories.name;
      return map;
    }, {});

    const products = await productModel.find();
    const productCateName = products.map(product => ({
      ...product.toObject(),
      nameCategories: categoriesMap[product.categoryId] || 'Không xác định'
    }));

    res.json(productCateName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
});


router.post('/', cors(corsOptions), upload.single('image'), async function (req, res, next) {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const { name, price, rating, description, categoryId } = req.body;
    const image = `http://localhost:3003/images/${req.file.originalname}`;
    const newProduct = { _id: null, name, price, image, rating, description, categoryId }

    const data = await productModel.create(newProduct);
    res.status(200).json({ status: true, message: "Thêm sản phẩm thành công" });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ status: false, message: `Lỗi khi thêm sản phẩm: ${error.message}` });
  }
});

router.put('/_id/:id' ,upload.single('image'), async function (req, res, next) {
  try {
    const id = req.params.id;

    const { name, price, sale, rating, description, categoryId} = req.body;
    const updatedData = {
      name,
      price,
      sale,
      rating,
      description,
      categoryId,
    };

    if (req.file) {
      const image = `http://localhost:3003/images/${req.file.originalname}`;
      updatedData.image = image; 
    }

    const data = await productModel.findByIdAndUpdate(id, updatedData, { new: true });

    console.log(data);

    if (!data) {
      return res.status(404).json({ status: false, message: "Sản phẩm không tồn tại" });
    }

    res.status(200).json({ status: true, message: "Cập nhật sản phẩm thành công", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Lỗi khi cập nhật sản phẩm" });
  }
});


router.delete('/_id/:id', async function (req, res, next) {
  try {
    const id = req.params.id;

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ status: false, message: "Sản phẩm không tồn tại" });
    }

    res.status(200).json({ status: true, message: "Xóa sản phẩm thành công", data: deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Lỗi khi xóa sản phẩm" });
  }
});

module.exports = router;