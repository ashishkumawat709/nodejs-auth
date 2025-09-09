const jwt =  require('jsonwebtoken')

const authMiddleware = async(req,res,next) =>{
  console.log('auth middleware is called');
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1]

  if(!token){
    return res.status(401).json({
      success : false,
      message : 'Access denied, no token provided, please login to continue'
    })
  }

  //decode token
  try {
    const decodetoekn = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodetoekn);

    req.userInfo = decodetoekn;
    next();
     
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : 'Access denied, no token provided, please login to continue'
    })
  }

}

module.exports = authMiddleware