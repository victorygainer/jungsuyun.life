const { Profile } = require('../models');
const { Work } = require('../models');

exports.home = async (req, res) => {
    if(req.session.is_logined){
      res.render('admin/home', {csrfToken: req.csrfToken()});
    } else {
      res.render('admin/login');
    }
  };
  
  exports.profile = async (req, res) => {
    if(req.session.is_logined){
      const profiles = await Profile.findAll({
        order: [
          ['year', 'DESC'],
          ['title', 'ASC'] 
      ]
      });
      res.render('admin/profile', {csrfToken: req.csrfToken(), profiles});
    } else {
      res.render('admin/login');
    }
  };

  exports.work = async (req, res) => {
    if(req.session.is_logined){
      const works = await Work.findAll({
        order: [
          ['year', 'DESC'],
          ['title', 'ASC'] 
      ]
      });
      res.render('admin/work', {csrfToken: req.csrfToken(), works});
    } else {
      res.render('admin/login');
    }
  };