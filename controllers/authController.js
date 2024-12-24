require('dotenv').config();

const bcrypt = require('bcrypt');
const adminId = process.env.ADMIN_ID;


exports.login = async (req, res) => {
  if(req.session.is_logined){
    res.render('admin/home', { csrfToken: req.csrfToken() });
  } else {
    res.render('admin/login', { csrfToken: req.csrfToken(), recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY});
  }
};

exports.login_process = async (req, res) => {
  var post = req.body;
  var id = post.id;
  var pwd = post.password;

  // 비밀번호 해시화 및 비교
  const hashedAdminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const passwordMatch = await bcrypt.compare(pwd, hashedAdminPassword);


  if (id === adminId && passwordMatch ) {
    req.session.is_logined = true;
    res.render('admin/home', { csrfToken: req.csrfToken() });
  } else {
    res.redirect('/admin?loginFailed=true');
  }
};