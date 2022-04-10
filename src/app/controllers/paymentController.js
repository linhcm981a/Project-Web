const Course = require("../models/Course");
const { mutipleMongooseToObject } = require("../../util/mongose");

class paymentController {
  //GET/  ->Home
  index(req, res, next) {
    Course.find({})
      .then((courses) => {
        res.render("home", {
          courses: mutipleMongooseToObject(courses),
        });
      })
      .catch(next);
  }

  //GET/search
  payment(req, res) {
    res.render("payment");
  }
}

module.exports = new paymentController();
