const md5 = require("md5");
const generateHelper = require("../../../helper/generate.js");
const ForgotPassword = require("../models/forgot-password.model");
const sendMailHelper = require("../../../helper/sendMail");
const User = require("../models/user.model");

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password);

  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if(existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại!"
    });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password
    });

    user.save();

    const token = user.token;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công!",
      token: token
    });
  }
};


// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);
  const user = await User.findOne({
    email: email,
    deleted: false
  });
  
  if(!user){
    res.json({
      code: 400,
      message: "email không tồn tại!"
    });
    return;
  }
  if(password != user.password){
    res.json({
      code: 400,
      message: "sai mật khẩu!"
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "đăng nhập thành công!",
    token
  })

};


// [POST] /api/v1/password/forgot
module.exports.forgotPassword = async (req, res) =>{
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!"
    });
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);

  const timeExpire = 5;

  // Lưu data vào database
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire*60,
  };
  
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Gửi OTP qua email user
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
  `;

  sendMailHelper.sendMail(email, subject, html);

  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email!"
  });
};


// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!result) {
    res.json({
      code: 400,
      message: "OTP không hợp lệ!"
    });
    return;
  }

  const user = await User.findOne({
    email: email
  });

  const token = user.token;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Xác thực thành công!",
    token: token
  });
};