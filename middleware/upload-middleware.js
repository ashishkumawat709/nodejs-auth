const multer = require('multer');
const path = require('path');

//set multer storage and filename
const storage = multer.diskStorage({
  destination : function (req,file,cb){
    cb(null, "uploads/")
  },
  filename : function (req,file, cb){
   cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); 
  }
})

//file filter 

const checkfilefilter = (req, file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null, true)
  }else{
    cb(new Error('Not an image, please upload only images') )
  }
}

//multer middleware

module.exports = multer({
  storage : storage,
  fileFilter : checkfilefilter,
  limits : {
    fileSize : 5 * 1024 * 1024 // 5mb size
  }
})