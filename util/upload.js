let multer = require('multer')


let storage = multer.diskStorage({
  destination: './cdnImg/',
  filename: function (req, file, cb) {
    // file: { fieldname: 'avatar', originalname: 'user.avatar.5.png', encoding: '7bit', mimetype: 'image/png' }
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('\/')[1]}`)
  }
})
let cdnImgUpload = multer({storage});


// app.use(upload.any());// 文件POST数据 接受一切上传的文件。文件数组将保存在 req.files。警告: 确保你总是处理了用户的文件上传。


module.exports = {
  cdnImgUpload
};
