var express = require('express');
var categoriesModel = require('../model/categoriesModel')
var router = express.Router();
var cors = require('cors');
// const multer  = require('multer')
const mongoose = require('mongoose');
const multer = require('multer')



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
    const data = await categoriesModel.find();
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
    const data = await categoriesModel.findById(id);
    if (data) {
      res.json(data);
      console.log('Fetched data: ', data);
    } else {
      res.status(404).json({ status: false, message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
});
// router.post('/', cors(corsOptions), async function (req, res, next) {
//   try {
//     const { _id, name, img, imgdetail: { img1, img2, img3, img4, img5, img6 }, giagoc, sale, banchay, tonkho, xuatxu, kichthuoc, cannang, mota, chatlieuId, thuonghieuId } = req.body;
//     const data = await productModel.create({
//       _id: null,
//       name,
//       img,
//       imgdetail: {
//         img1,
//         img2,
//         img3,
//         img4,
//         img5,
//         img6,
//       },
//       giagoc,
//       sale,
//       banchay,
//       tonkho,
//       xuatxu,
//       kichthuoc,
//       cannang,
//       mota,
//       chatlieuId,
//       thuonghieuId
//     });
//     res.status(200).json({ status: true, message: "Thêm sản phẩm thành công" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: "Lỗi khi thêm sản phẩm" });
//   }
// });

// router.put('/_id/:id', async function (req, res, next) {
//   try {
//     const id = req.params.id;

//     const { name, img, imgdetail: { img1, img2, img3, img4, img5, img6 }, giagoc, sale, banchay, tonkho, xuatxu, kichthuoc, cannang, mota, chatlieuId, thuonghieuId } = req.body;

//     const updatedData = {
//       name,
//       img,
//       imgdetail: {
//         img1,
//         img2,
//         img3,
//         img4,
//         img5,
//         img6,
//       },
//       giagoc,
//       sale,
//       banchay,
//       tonkho,
//       xuatxu,
//       kichthuoc,
//       cannang,
//       mota,
//       chatlieuId,
//       thuonghieuId
//     };

//     const data = await productModel.findByIdAndUpdate(id, updatedData, { new: true });

//     console.log(data);

//     if (!data) {
//       return res.status(404).json({ status: false, message: "Sản phẩm không tồn tại" });
//     }

//     res.status(200).json({ status: true, message: "Cập nhật sản phẩm thành công", data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: "Lỗi khi cập nhật sản phẩm" });
//   }
// });

// router.delete('/_id/:id', async function (req, res, next) {
//   try {
//     const id = req.params.id;

//     const deletedProduct = await productModel.findByIdAndDelete(id);

//     if (!deletedProduct) {
//       return res.status(404).json({ status: false, message: "Sản phẩm không tồn tại" });
//     }

//     res.status(200).json({ status: true, message: "Xóa sản phẩm thành công", data: deletedProduct });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: "Lỗi khi xóa sản phẩm" });
//   }
// });

// router.get('/search/:keyword', async function (req, res, next) {
//   try {
//     const keyword = req.params.keyword;
//     const products = await productModel.find({ name: new RegExp(keyword, 'i') })
//     if (products) {
//       res.status(200).json(products);
//     } else {
//       res.status(404).json({ message: "Không tìm thấy" })
//     }
//   } catch (error) {
//     res.status(500).json({ status: false, message: "Lỗi khi tìm sản phẩm" });
//   }
// })


// router.get('/thuonghieuId/:id', cors(corsOptions), async function (req, res, next) {
//   try {
//     const id = req.params.id;
//     console.log(id);
//     const data = await productModel.find({ thuonghieuId: id });
//     if (data) {
//       res.json(data);
//       console.log('Fetched data: ', data);
//     } else {
//       res.status(404).json({ status: false, message: 'Product not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: 'Internal server error' });
//   }
// });
// router.get('/chatlieuId/:id', cors(corsOptions), async function (req, res, next) {
//   try {
//     const id = req.params.id;
//     console.log(id);
//     const data = await productModel.find({ chatlieuId: id });
//     if (data) {
//       res.json(data);
//       console.log('Fetched data: ', data);
//     } else {
//       res.status(404).json({ status: false, message: 'Product not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: 'Internal server error' });
//   }
// });


// router.get('/thuonghieuName/:id', cors(corsOptions), async function (req, res, next) {
//   try {
//     const id = req.params.id;
//     console.log(id);
//     const data = await productModel.findById(id);
//     if (data) {
//       const thuonghieuId = data.thuonghieuId ;
//       try {
//         const id = thuonghieuId
//         const nameThuongHieu = await thuonghieuModel.findById(id)
//         if (nameThuongHieu) {
//           res.json({name:nameThuongHieu.name})
//           console.log(nameThuongHieu);
//         }
//         else {
//           res.status(404).json({ status: false, message: 'Product not found' });
//         }
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: false, message: 'Internal server error' });
//       }

//       console.log('Fetched data: ', thuonghieuId);
//     } else {
//       res.status(404).json({ status: false, message: 'Product not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: 'Internal server error' });
//   }
// });

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

    const { name } = req.body;
    const image = `http://localhost:3003/images/${req.file.originalname}`;
    const newCategory = { _id: null, name, image }

    const data = await categoriesModel.create(newCategory);
    res.status(200).json({ status: true, message: "Thêm sản phẩm thành công" });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ status: false, message: `Lỗi khi thêm sản phẩm: ${error.message}` });
  }
});

router.put('/_id/:id', upload.single('image'), async function (req, res, next) {
  try {
    const id = req.params.id;

    const { name } = req.body;
    const updatedData = {
      name,
    };

    if (req.file) {
      const image = `http://localhost:3003/images/${req.file.originalname}`;
      updatedData.image = image;
    }

    const data = await categoriesModel.findByIdAndUpdate(id, updatedData, { new: true });

    console.log(data);

    if (!data) {
      return res.status(404).json({ status: false, message: "Danh mục không tồn tại" });
    }

    res.status(200).json({ status: true, message: "Cập nhật danh mục thành công", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Lỗi khi danh mục sản phẩm" });
  }
});
router.delete('/_id/:id', async function (req, res, next) {
  try {
    const id = req.params.id;

    const deletedProduct = await categoriesModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ status: false, message: "Danh mục không tồn tại" });
    }

    res.status(200).json({ status: true, message: "Xóa danh mục thành công", data: deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Lỗi khi xóa danh mục" });
  }
});

module.exports = router;