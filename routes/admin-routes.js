const express = require('express');
const authMiddleware = require('../middleware/auth-middleware')
const adminiddleware = require('../middleware/admin-middleware')
const router =  express.Router();

router.get('/welcome',authMiddleware, adminiddleware,(req,res)=>{
  res.json({
    message : 'Welcome to admin page'
  })
})

module.exports = router;