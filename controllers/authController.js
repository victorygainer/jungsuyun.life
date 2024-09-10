require('dotenv').config();

const adminId = process.env.ADMIN_ID;
const adminPassword = process.env.ADMIN_PASSWORD;

exports.login = async (req, res) => {
  if(req.session.is_logined){
    res.render('admin/home', { csrfToken: req.csrfToken() });
  } else {
    res.render('admin/login', { csrfToken: req.csrfToken() });
  }
};

exports.login_process = async (req, res) => {
  var post = req.body;
  var id = post.id;
  var pwd = post.password;

  if (id === adminId && pwd === adminPassword) {
    req.session.is_logined = true;
    res.render('admin/home', { csrfToken: req.csrfToken() });
  } else {
    res.redirect('/admin?loginFailed=true');
  }
};