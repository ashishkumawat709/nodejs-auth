const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    //extract user info
    const { username, email, password, role } = req.body;
    //check if user already in db
    const checkexistinguser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkexistinguser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists either with same username or email, so use other",
      });
    }

    //hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newlyCreatedUSer = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newlyCreatedUSer.save();
    if (newlyCreatedUSer) {
      res.status(200).json({
        success: true,
        message: "User registered",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not exists",
      });
    }

    const ispasswordmatch = await bcrypt.compare(password, user.password);
    if (!ispasswordmatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }

  

    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "log in success",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//only logged in users can change the passsword
const changePassword = async(req,res)=>{
  try {
    const userId = req.userInfo.userId;
    //extract old and new pass
    const {oldpassword, newpassword} = req.body;

    //find current logged in user
    const user = await User.findById(userId);
    if(!user){
      res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    //check if old password entered by user is correct and matches with the password stored in db

    const ispasswordmatch = await bcrypt.compare(oldpassword, user.password);
    if(!ispasswordmatch){
      return res.status(400).json({
        success: false,
        message: "old password is not correct",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newhashpassword =  await bcrypt.hash(newpassword, salt);
    //update new pass
    user.password = newhashpassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "password changed successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
}

module.exports = { registerUser, loginUser, changePassword };
