const Image = require('../models/image');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
const fs = require('fs')
const cloudinary = require('../config/cloudinary');

const uploadController = async(req,res)=>{
  try {
    if(!req.file){
      res.status(400).json({
        success : false,
        message : "file is missing"
      })
    }

    const {url, publicId} = await uploadToCloudinary(req.file.path);
    
    const newImg = new Image({
      url,
      publicId,
      uploadedBy : req.userInfo.userId
    })

    await newImg.save();
//delete the file from local
fs.unlinkSync(req.file.path)

    res.status(201).json({
      success : true,
      message : "img uploaded",
      img : newImg
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : "something went wrong"
    })
    
  } 
}

const fetchImagesController = async(req,res)=>{
  try {
    //code to sort imgs
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page -1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const totalImages  = await Image.countDocuments();
    const totalpages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;


    //code to fetch all imgs
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    // const images = await Image.find({});
    if(images){
      res.status(200).json({
        success : true,
        currentPage : page,
        totalImages : totalImages,
        totalpages : totalpages,
        data : images
        
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : "something went wrong"
    })
  }
}

const deleteImagesController = async(req,res)=>{
  try {
    const getcurrentIdofimg = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getcurrentIdofimg);
    if(!image){
      res.status(404).json({
        success : false,
        message : "image not found"
      })
    }
    //check if this img is uploaded by current user who uploaded it 

    if(image.uploadedBy.toString() !== userId){
      res.status(403).json({
        success : false,
        message : "you cant delete this img as it is not uploaded by you"
      })
    }

    //delete this img from cloudinary 
    await cloudinary.uploader.destroy(image.publicId);

     //delete this img from mongo
      await Image.findByIdAndDelete(getcurrentIdofimg);
      console.log('img deleted from mongo');
      
      res.status(200).json({
        success : true,
         message : "img deleted success",
      })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : "something went wrong"
    })
  }
}

module.exports = {uploadController, fetchImagesController, deleteImagesController}