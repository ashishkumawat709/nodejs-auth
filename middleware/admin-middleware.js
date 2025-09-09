const isAdminuser = (req,res, next)=>{
  if(req.userInfo.role !== 'admin'){
    return res.status(403).json({
      success : false,
      message : 'Access denied, user must be admin'
    })
  }
  next()
}

module.exports = isAdminuser
