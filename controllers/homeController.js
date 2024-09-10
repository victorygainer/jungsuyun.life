const { Work } = require('../models');
const { sequelize } = require('../models');

exports.getHome = async (req, res, next) => {
  try {

    const randomWork = await Work.findOne({
      order: sequelize.random(),
      limit: 1
    });

    if (randomWork) {
      res.render('home',{ csrfToken: req.csrfToken(), randomWork: randomWork });
    } else {
      res.status(404).send('No work found');
    }
  } catch (error) {
    console.error('Error fetching random work:', error);
    res.status(500).send('Server error');
  }
};