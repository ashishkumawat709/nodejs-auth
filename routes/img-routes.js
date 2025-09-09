const express = require('express');
const authMiddleware = require('../middleware/auth-middleware')
const adminiddleware = require('../middleware/admin-middleware')
const uploadmiddleware = require('../middleware/upload-middleware')
const {uploadController, fetchImagesController, deleteImagesController} = require('../controllers/imageController')
const router =  express.Router();

router.post('/upload', authMiddleware, adminiddleware,uploadmiddleware.single('image'), uploadController);

router.get('/get', authMiddleware, fetchImagesController)
router.delete('/:id', authMiddleware, adminiddleware, deleteImagesController)

module.exports = router

//68bd774caeae99acb808bfe0